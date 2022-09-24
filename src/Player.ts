import {
  MinecraftClient,
  MinecraftServerClient,
} from '@minecraft-js/protocol-1.8';
import { parseUUID, UUID } from '@minecraft-js/uuid';
import {
  LunarClientMod,
  LunarClientPluginChannel,
  NotificationLevel,
  ServerRuleEnum,
  ServerRuleValue,
  StaffMod,
  TeammatePlayer,
  Waypoint,
} from './constants';
import type { ModSettingsPacket, ServerRulePacket } from './protocol';
import { Packet } from './protocol/Packet';
import LunarClientPacketReader from './protocol/PacketReader';
import LunarClientPacketWriter from './protocol/PacketWriter';

/**
 * Class that represents a Lunar Client player
 */
export class LunarClientPlayer {
  /**
   * Whether or not a connection
   * has been established with the
   * client
   */
  public isConnected: boolean;
  /** UUID for this player */
  public uuid: UUID;
  /**
   * Plugin channel used to establish the
   * connection, defaults to
   * `LunarClientPluginChannel.NEW`
   */
  public readonly channel: LunarClientPluginChannel;

  /** Waypoints loaded by the client */
  public waypoints: Waypoint[];
  /** Current teammates of the client */
  public teammates: TeammatePlayer[];
  /**
   * Current active cooldowns.
   * This list contains the ids of the cooldowns
   */
  public cooldowns: string[];
  /**
   * Current mod settings for the client. Key (mod id): Value (mod setting)
   */
  public modSettings: ModSettingsPacket['data']['settings'];

  /** Options passed in the constructor */
  private readonly options?: LunarClientPlayerOptions;
  /** Internal packet handler */
  private readonly packetReader: LunarClientPacketReader;

  /**
   * Instantiate a new Lunar Client player
   * class.
   *
   * This high level API will let you
   * *"control"* a bit the client.
   * @param options Options to pass
   * @example
   * ```javascript
   * const player = new LunarClientPlayer({
   *   customHandling: {
   *     sendPacket: (buffer) {
   *        // Somehow send the packet
   *        // to the client
   *     },
   *     registerPluginChannel: (channel) {
   *        // Somehow register the channel
   *     }
   *   }
   * });
   *
   * // Establish the connection
   * // using plugin channels
   * player.connect();
   *
   * // You can now call any method
   * // from the class
   * ```
   */
  public constructor(options?: LunarClientPlayerOptions) {
    this.options = options;

    if (!this.options.customHandling && !this.options.client)
      throw new Error(
        'You must provide a custom handling or a MinecraftServerClient/MinecraftClient'
      );

    if (this.options?.channelAlreadyRegistered) this.isConnected = true;
    else this.isConnected = false;

    this.uuid = options?.playerUUID ?? null;
    this.channel = this.options?.pluginChannel || LunarClientPluginChannel.NEW;

    this.waypoints = [];
    this.teammates = [];
    this.cooldowns = [];
  }

  /**
   * Send the register
   * plugin channel packet
   */
  public connect(): void {
    this.registerPluginChannels();
  }

  /**
   * Add a waypoint to the client
   * @param waypoint Waypoint to add
   * @returns Whether or not this operation was successful
   */
  public addWaypoint(waypoint: Waypoint): boolean {
    if (this.waypoints.find((w) => w.name === waypoint.name)) return false;
    this.waypoints.push(waypoint);

    const { packet } = new LunarClientPacketWriter('WaypointAddPacket', {
      ...waypoint,
      world: '',
    });

    this.sendPacket(packet);
    return true;
  }

  /**
   * Remove a waypoint from the client
   * @param waypoint Waypoint object or waypoint name
   * @returns Whether or not this operation was successful
   */
  public removeWaypoint(waypoint: string | Waypoint): boolean {
    waypoint = typeof waypoint === 'string' ? waypoint : waypoint.name;

    if (!this.waypoints.find((w) => w.name === waypoint)) return false;
    this.waypoints = this.waypoints.filter((w) => w.name !== waypoint);

    const { packet } = new LunarClientPacketWriter('WaypointRemovePacket', {
      name: waypoint,
      world: '',
    });

    this.sendPacket(packet);
    return true;
  }

  /**
   * Remove all waypoints loaded by the player
   */
  public removeAllWaypoints(): void {
    for (const waypoint of this.waypoints) this.removeWaypoint(waypoint);
    this.waypoints = [];
  }

  /** Send a notification to the client
   * @param message Message to send
   * @param durationMs Duration of the message in milliseconds
   * @param level Message level, defaults to `NotificationLevel.INFO`
   * @deprecated This packet is not supported by the client by default
   */
  public sendNotification(
    message: string,
    durationMs: number,
    level: NotificationLevel = NotificationLevel.INFO
  ): void {
    const { packet } = new LunarClientPacketWriter('NotificationPacket', {
      message,
      durationMs,
      level,
    });

    this.sendPacket(packet);
  }

  /**
   * Add a teammate to the client.
   *
   * The TeamView mod must be enabled
   * in order for this to work
   * @param teammate Teammate to add
   * @returns Whether or not this operation was successful
   */
  public addTeammate(teammate: TeammatePlayer): boolean {
    if (this.teammates.find((t) => t.uuid === teammate.uuid)) return false;
    this.teammates.push(teammate);

    this.sendTeammateList();
    return true;
  }

  /**
   * Remove a teammate from the client.
   *
   * The TeamView mod must be enabled
   * in order for this to work
   * @param teammate Teammate UUID or teammate object
   * @returns Whether or not this operation was successful
   */
  public removeTeammate(teammate: string | UUID | TeammatePlayer): boolean {
    teammate =
      typeof teammate === 'string'
        ? parseUUID(teammate)
        : teammate instanceof UUID
        ? teammate
        : teammate.uuid;

    if (!this.teammates.find((t) => t.uuid === teammate)) return false;
    this.teammates = this.teammates.filter((t) => t.uuid !== teammate);

    this.sendTeammateList();
    return true;
  }

  /**
   * Remove all teammates from the client.
   *
   * The TeamView mod must be enabled
   * in order for this to work
   */
  public removeAllTeammates(): void {
    this.teammates = [];
    this.sendTeammateList();
  }

  /**
   * Send the teammates packet
   * to the client
   */
  private sendTeammateList(): void {
    const { packet } = new LunarClientPacketWriter('TeammatesPacket', {
      leader: this.uuid,
      lastMs: Date.now(),
      players: this.teammates.map((teammate) => ({
        uuid: teammate.uuid,
        posMap: {
          x: teammate.x ?? 0,
          y: teammate.y ?? 0,
          z: teammate.z ?? 0,
        },
      })),
    });

    this.sendPacket(packet);
  }

  /**
   * Add a cooldown to the client
   * @param id String id of the cooldown, used to remove it later
   * @param durationMs Duration of the cooldown in milliseconds
   * @param iconId Icon id to use, same system as [minecraft ids](https://minecraft-ids.grahamedgecombe.com/)
   * @returns Whether or not this operation was successful
   */
  public addCooldown(id: string, durationMs: number, iconId: number): boolean {
    if (this.cooldowns.find((c) => c === id)) return false;
    this.cooldowns.push(id);

    setTimeout(
      () => (this.cooldowns = this.cooldowns.filter((c) => c !== id)),
      durationMs
    );

    const { packet } = new LunarClientPacketWriter('CooldownPacket', {
      id,
      durationMs,
      iconId,
    });

    this.sendPacket(packet);
    return true;
  }

  /**
   * Remove a cooldown from the client
   * @param id String id of the cooldown
   * @returns Whether or not this operation was successful
   */
  public removeCooldown(id: string): boolean {
    if (!this.cooldowns.find((c) => c === id)) return false;
    this.cooldowns = this.cooldowns.filter((c) => c !== id);

    const { packet } = new LunarClientPacketWriter('CooldownPacket', {
      id,
      durationMs: 0,
      iconId: 0,
    });

    this.sendPacket(packet);
    return true;
  }

  /**
   * Set the state of the given Staff Mod for the client
   * @param mod Staff mod to apply the state to
   * @param state State to apply
   */
  public setStaffModState(mod: StaffMod, state: boolean): void {
    const { packet } = new LunarClientPacketWriter('StaffModStatePacket', {
      mod,
      state,
    });
    this.sendPacket(packet);
  }

  /**
   * Set a server rule for the client.
   * @param serverRule Server rule to set the value to
   * @param value Value to set, usually a boolean but could be `NEUTRAL` or `FORCED_OFF` when the server rule is minimap status or number
   * @param valueType Tell the method how the value should be encoded, defaults to `boolean`
   */
  public setServerRule(
    serverRule: ServerRuleEnum,
    value: boolean | number | string,
    valueType: ServerRuleValue = 'boolean'
  ): void {
    // Known server rule that has a string
    if (serverRule === ServerRuleEnum.MINIMAP_STATUS) valueType = 'string';

    const data: ServerRulePacket['data'] = { rule: serverRule };
    // @ts-ignore I have no idea on how
    // to type this but it works fine
    data[`${valueType}Value`] = value;

    const { packet } = new LunarClientPacketWriter('ServerRulePacket', data);

    this.sendPacket(packet);
  }

  /**
   * Set multiple rules at once
   * @see `LunarClientPlayer#setServerRule` for implementation
   * @param serverRules Rules to set
   */
  public setServerRules(
    ...serverRules: {
      serverRule: ServerRuleEnum;
      value: boolean | number | string;
      valueType?: ServerRuleValue;
    }[]
  ): void {
    for (const rule of serverRules)
      this.setServerRule(
        rule.serverRule,
        rule.value,
        rule.valueType ?? 'boolean'
      );
  }

  /**
   * Set a forced state for the given mod
   * @param mod Mod to set the setting for
   * @param enabled Whether the mod should be force enabled or force disabled
   * @param properties
   * @returns Whether or not the operation was successful
   */
  public addModSetting(
    mod: LunarClientMod,
    enabled: boolean,
    properties: { [key: string]: unknown }
  ): boolean {
    if (this.modSettings[mod]) return false;
    this.modSettings[mod] = { enabled, properties };

    this.sendModSettings();
    return true;
  }

  /**
   * Remove a forced state for the given mod
   * @param mod Mod to remove the forced state
   * @returns Whether or not the operation was successful
   */
  public removeModSetting(mod: LunarClientMod): boolean {
    if (!this.modSettings[mod]) return false;
    delete this.modSettings[mod];

    this.sendModSettings();
    return true;
  }

  /**
   * Send the ModSettings
   * packet to the client
   */
  private sendModSettings(): void {
    const { packet } = new LunarClientPacketWriter('ModSettingsPacket', {
      settings: this.modSettings,
    });

    this.sendPacket(packet);
  }

  /**
   * Read the given packet.
   *
   * Call this method only if you
   * want to manually override
   * the packet handling
   * @param buffer Packet to read
   */
  public readPacket(buffer: Buffer): void {
    this.packetReader.read(buffer);
  }

  /**
   * Transfer the client to the given server
   * @param servers Array of server ips
   */
  public transfer(servers: string[]): void {
    const { packet } = new LunarClientPacketWriter('TransferPacket', {
      servers,
    });

    this.sendPacket(packet);
  }

  /**
   * Register the required Plugin Channel
   * on the client to communicate to the
   * client/server.
   * Registers:
   * - The communication channel (`lunarclient:pm` or `Lunar-Client`)
   * - The transfer packet channel (`transfer:channel`)
   */
  private registerPluginChannels(): void {
    const channels = [this.channel, LunarClientPluginChannel.TRANSFER];

    if (this.options?.customHandling?.registerPluginChannel) {
      for (const channel of channels)
        this.options.customHandling.registerPluginChannel(channel);

      return void (this.isConnected = true);
    }

    if (this.options.client) {
      for (const channel of channels) {
        // @ts-ignore We can safely ignore this issue because
        // the PluginMessagePacket is available in both
        // serverbound and clientbound contexts
        const pluginMessage = this.options.client.packetWriter.write(
          'PluginMessagePacket',
          {
            channel: 'REGISTER',
            data: Buffer.from(`${channel}\0`),
          }
        );

        this.options.client.writeRaw(pluginMessage);
      }

      return void (this.isConnected = true);
    }
  }

  /**
   * Send a packet to the client, will use
   * the provided sendPacket function in options
   * if the protocol handler isn't available.
   * @param buffer Packet to send to the client
   */
  private sendPacket(
    packet: Buffer | Packet<unknown>,
    channel?: LunarClientPluginChannel
  ): void {
    const buffer = packet instanceof Packet ? packet.buf.buffer : packet;

    if (this.options?.customHandling?.sendPacket)
      return void this.options.customHandling.sendPacket(
        buffer,
        channel ?? this.channel
      );

    if (this.options.client) {
      // @ts-ignore We can safely ignore this issue because
      // the PluginMessagePacket is available in both
      // serverbound and clientbound contexts
      const pluginMessage = this.options.client.packetWriter.write(
        'PluginMessagePacket',
        {
          channel: channel ?? this.channel,
          data: buffer,
        }
      );

      this.options.client.writeRaw(pluginMessage);
    }
  }
}

/**
 * Options that can be passed to
 * instantiate a new LunarClientPlayer
 */
export interface LunarClientPlayerOptions {
  /**
   * Whether or not the plugin channel
   * has already been registered.
   *
   * If this is set to `true`, the channel
   * registration process will be skipped
   * and this instance will asume
   * that the channel is already registedred
   * and that the player is running
   * Lunar Client.
   */
  channelAlreadyRegistered?: boolean;
  /**
   * Plugin channel to use in the
   * channel registration process
   */
  pluginChannel?: LunarClientPluginChannel;
  /***
   * The Minecraft client to attach
   * this Lunar Client player to
   */
  client?: MinecraftServerClient | MinecraftClient;
  /**
   * Functions that will be called when
   * a certain action should be done,
   * for example, sending a packet.
   *
   * For now you must specify these
   * because no protocol handler
   * is written yet. If you don't specify
   * any an error will be thrown.
   */
  customHandling?: {
    sendPacket: (buffer: Buffer, channel: LunarClientPluginChannel) => void;
    registerPluginChannel: (channel: LunarClientPluginChannel) => void;
  };
  /**
   * UUID for this player
   *
   * This is used in the teammates
   * packet for the leader field
   * @see [TeammatesPacket](./protocol/client/TeammatesPacket.ts)
   */
  playerUUID?: UUID;
}
