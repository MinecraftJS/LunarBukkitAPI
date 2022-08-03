import { Packet } from '../Packet';

export class WorldBorderUpdatePacket extends Packet<WorldBorderUpdate> {
  public static id = 22;

  public write(data?: WorldBorderUpdate): void {
    this.data = data || this.data;

    this.buf.writeString(this.data.id);
    this.buf.writeDouble(this.data.minX);
    this.buf.writeDouble(this.data.minZ);
    this.buf.writeDouble(this.data.maxX);
    this.buf.writeDouble(this.data.maxZ);
    this.buf.writeInt(this.data.durationTicks);

    this.buf.finish();
  }

  public read(): WorldBorderUpdate {
    this.data = {
      id: this.buf.readString(),
      minX: this.buf.readDouble(),
      minZ: this.buf.readDouble(),
      maxX: this.buf.readDouble(),
      maxZ: this.buf.readDouble(),
      durationTicks: this.buf.readInt(),
    };

    return this.data;
  }
}

/**
 * World border remove packet
 * @see https://github.com/LunarClient/BukkitAPI-NetHandler/blob/master/src/main/java/com/lunarclient/bukkitapi/nethandler/client/LCPacketWorldBorderUpdate.java
 */
interface WorldBorderUpdate {
  id: string;
  minX: number;
  minZ: number;
  maxX: number;
  maxZ: number;
  durationTicks: number;
}
