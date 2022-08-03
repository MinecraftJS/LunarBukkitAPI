import { Packet } from '../Packet';

export class WorldBorderUpdateNewPacket extends Packet<WorldBorderUpdateNew> {
  public static id = 30;

  public write(data?: WorldBorderUpdateNew): void {
    this.data = data || this.data;

    this.buf.writeString(this.data.id);
    this.buf.writeDouble(this.data.minX);
    this.buf.writeDouble(this.data.minZ);
    this.buf.writeDouble(this.data.maxX);
    this.buf.writeDouble(this.data.maxZ);
    this.buf.writeInt(this.data.durationTicks);
    this.buf.writeBoolean(this.data.cancelsEntry);
    this.buf.writeBoolean(this.data.cancelsExit);
    this.buf.writeInt(this.data.color);

    this.buf.finish();
  }

  public read(): WorldBorderUpdateNew {
    this.data = {
      id: this.buf.readString(),
      minX: this.buf.readDouble(),
      minZ: this.buf.readDouble(),
      maxX: this.buf.readDouble(),
      maxZ: this.buf.readDouble(),
      durationTicks: this.buf.readInt(),
      cancelsEntry: this.buf.readBoolean(),
      cancelsExit: this.buf.readBoolean(),
      color: this.buf.readInt(),
    };

    return this.data;
  }
}

/**
 * World border remove new packet
 * @see https://github.com/LunarClient/BukkitAPI-NetHandler/blob/master/src/main/java/com/lunarclient/bukkitapi/nethandler/client/LCPacketWorldBorderUpdateNew.java
 */
interface WorldBorderUpdateNew {
  id: string;
  minX: number;
  minZ: number;
  maxX: number;
  maxZ: number;
  durationTicks: number;
  cancelsEntry: boolean;
  cancelsExit: boolean;
  color: number;
}
