import { Packet } from '../Packet';

export class HologramUpdatePacket extends Packet<HologramUpdate> {
  public static id = 5;

  public write(data?: HologramUpdate): void {
    this.data = data || this.data;

    this.buf.writeUUID(this.data.uuid);
    this.buf.writeVarInt(this.data.lines.length);
    for (const line of this.data.lines) this.buf.writeString(line);

    this.buf.finish();
  }

  public read(): HologramUpdate {
    const uuid = this.buf.readUUID();

    const linesLength = this.buf.readVarInt();
    const lines: string[] = [];
    for (let i = 0; i < linesLength; i++) lines.push(this.buf.readString());

    this.data = {
      uuid,
      lines,
    };

    return this.data;
  }
}

/**
 * Hologram update packet
 * @see https://github.com/LunarClient/BukkitAPI-NetHandler/blob/master/src/main/java/com/lunarclient/bukkitapi/nethandler/client/LCPacketHologram.java
 */
interface HologramUpdate {
  /** UUID of the hologram */
  uuid: string;
  /** Lines displayed in the hologram */
  lines: string[];
}
