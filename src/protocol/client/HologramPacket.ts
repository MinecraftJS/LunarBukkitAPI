import { Packet } from '../Packet';

export class HologramPacket extends Packet<Hologram> {
  public static id = 4;

  public write(data?: Hologram): void {
    this.data = data || this.data;

    this.buf.writeUUID(this.data.uuid);
    this.buf.writeDouble(this.data.x);
    this.buf.writeDouble(this.data.y);
    this.buf.writeDouble(this.data.z);
    this.buf.writeVarInt(this.data.lines.length);
    for (const line of this.data.lines) this.buf.writeString(line);

    this.buf.finish();
  }

  public read(): Hologram {
    const uuid = this.buf.readUUID();
    const x = this.buf.readDouble();
    const y = this.buf.readDouble();
    const z = this.buf.readDouble();

    const linesLength = this.buf.readVarInt();
    const lines: string[] = [];
    for (let i = 0; i < linesLength; i++) lines.push(this.buf.readString());

    this.data = {
      uuid,
      x,
      y,
      z,
      lines,
    };

    return this.data;
  }
}

/**
 * Hologram packet
 * @see https://github.com/LunarClient/BukkitAPI-NetHandler/blob/master/src/main/java/com/lunarclient/bukkitapi/nethandler/client/LCPacketHologram.java
 */
interface Hologram {
  /** UUID of the hologram */
  uuid: string;
  /** X coordinate of the hologram */
  x: number;
  /** Y coordinate of the hologram */
  y: number;
  /** Z coordinate of the hologram */
  z: number;
  /** Lines displayed in the hologram */
  lines: string[];
}
