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
import PacketBuilder from './protocol/PacketBuilder';
import LunarClientPacketHandler from './protocol/PacketHandler';

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
  public uuid: string;
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
  private readonly handler: LunarClientPacketHandler;

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

    if (this.options?.channelAlreadyRegistered) this.isConnected = true;
    else this.isConnected = false;

    this.uuid = options?.playerUUID ?? '';
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
    if (this.options?.customHandling?.registerPluginChannel) {
      this.options.customHandling.registerPluginChannel(this.channel);
      this.isConnected = true;
      return;
    }

    throw new Error(
      'For now, you must provide a registerPluginChannel function in the options'
    );
  }

  /**
   * Add a waypoint to the client
   * @param waypoint Waypoint to add
   * @returns Whether or not this operation was successful
   */
  public addWaypoint(waypoint: Waypoint): boolean {
    if (this.waypoints.find((w) => w.name === waypoint.name)) return false;
    this.waypoints.push(waypoint);

    const { packet } = new PacketBuilder('WaypointAddPacket', {
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

    const { packet } = new PacketBuilder('WaypointRemovePacket', {
      name: waypoint,
      world: '',
    });

    this.sendPacket(packet);
    return true;
  }

  /**
   * Remove all waypoints loaded by the player
   */
  public removeAllWayoints(): void {
    for (const waypoint of this.waypoints) this.removeWaypoint(waypoint);
    this.waypoints = [];
  }

  /** Send a notification to the client
   * @param message Message to send
   * @param durationMs Duration of the message in milliseconds
   * @param level Message level, set to `info` by default
   * @deprecated This packet is not supported by the client by default
   */
  public sendNotification(
    message: string,
    durationMs: number,
    level: NotificationLevel
  ): void {
    const { packet } = new PacketBuilder('NotificationPacket', {
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
  public removeTeammate(teammate: string | TeammatePlayer): boolean {
    teammate = typeof teammate === 'string' ? teammate : teammate.uuid;

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
    const { packet } = new PacketBuilder('TeammatesPacket', {
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

    const { packet } = new PacketBuilder('CooldownPacket', {
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

    const { packet } = new PacketBuilder('CooldownPacket', {
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
    const { packet } = new PacketBuilder('StaffModStatePacket', { mod, state });
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

    const { packet } = new PacketBuilder('ServerRulePacket', data);

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
    const { packet } = new PacketBuilder('ModSettingsPacket', {
      settings: this.modSettings,
    });

    this.sendPacket(packet);
  }

  /**
   * Handle the given packet.
   *
   * Call this method only if you
   * want to manually override
   * the packet handling
   * @param buffer Packet to handle
   */
  public handlePacket(buffer: Buffer): void {
    this.handler.handle(buffer);
  }

  /**
   * Send a packet to the client, will use
   * the provided sendPacket function in options
   * if the protocol handler isn't available.
   * @param buffer Packet to send to the client
   */
  private sendPacket(packet: Buffer | Packet<unknown>): void {
    const buffer = packet instanceof Packet ? packet.buf.buffer : packet;

    if (this.options?.customHandling?.sendPacket)
      this.options.customHandling.sendPacket(buffer);

    throw new Error(
      'For now, you must provide a sendPacket function in the options'
    );
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
  customHandling: {
    sendPacket: (buffer: Buffer) => void;
    registerPluginChannel: (channel: LunarClientPluginChannel) => void;
  };
  /**
   * UUID for this player
   *
   * This is used in the teammates
   * packet for the leader field
   * @see [TeammatesPacket](./protocol/client/TeammatesPacket.ts)
   */
  playerUUID?: string;
}
