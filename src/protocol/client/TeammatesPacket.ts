import { Packet } from '../Packet';

export class TeammatesPacket extends Packet<Teammates> {
  public static id = 13;

  public write(data?: Teammates): void {
    this.data = data || this.data;

    this.buf.writeUUID(this.data.leader);
    this.buf.writeLong(this.data.lastMs);

    this.buf.writeVarInt(this.data.players.length);
    for (const player of this.data.players) {
      this.buf.writeUUID(player.uuid);

      const keys = Object.keys(player.posMap);
      this.buf.writeVarInt(keys.length);
      for (const key of keys) {
        this.buf.writeString(key);
        this.buf.writeDouble(player.posMap[key]);
      }
    }

    this.buf.finish();
  }

  public read(): Teammates {
    const leader = this.buf.readUUID();
    const lastMs = this.buf.readLong();

    const playersLength = this.buf.readVarInt();
    const players: Teammates['players'] = [];
    for (let i = 0; i < playersLength; i++) {
      const uuid = this.buf.readUUID();

      const posMapLength = this.buf.readVarInt();
      const posMap: { [key: string]: number } = {};
      for (let i = 0; i < posMapLength; i++)
        posMap[this.buf.readString()] = this.buf.readDouble();

      players.push({ uuid, posMap });
    }

    this.data = {
      leader,
      lastMs,
      players,
    };

    return this.data;
  }
}

/**
 * Teammates packet
 * @see https://github.com/LunarClient/BukkitAPI-NetHandler/blob/master/src/main/java/com/lunarclient/bukkitapi/nethandler/client/LCPacketTeammates.java
 */
interface Teammates {
  /** UUID of the team leader */
  leader: string;
  lastMs: number;
  /** List of the players in the team */
  players: {
    uuid: string;
    posMap: { [key: string]: number };
  }[];
}
