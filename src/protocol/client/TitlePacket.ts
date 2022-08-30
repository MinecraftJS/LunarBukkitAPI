import { Packet } from '../Packet';

export class TitlePacket extends Packet<Title> {
  public static id = 14;

  public write(data?: Title): void {
    this.data = data || this.data;

    this.buf.writeString(this.data.type);
    this.buf.writeString(this.data.message);
    this.buf.writeFloat(this.data.scale);
    this.buf.writeLong(this.data.displayTimeMs);
    this.buf.writeLong(this.data.fadeInTimeMs);
    this.buf.writeLong(this.data.fadeOutTimeMs);

    this.buf.finish();
  }

  public read(): Title {
    this.data = {
      type: this.buf.readString(),
      message: this.buf.readString(),
      scale: this.buf.readFloat(),
      displayTimeMs: this.buf.readLong(),
      fadeInTimeMs: this.buf.readLong(),
      fadeOutTimeMs: this.buf.readLong(),
    };

    return this.data;
  }
}

/**
 * Update world packet
 * @see https://github.com/LunarClient/BukkitAPI-NetHandler/blob/master/src/main/java/com/lunarclient/bukkitapi/nethandler/client/LCPacketTitle.java
 */
interface Title {
  type: string;
  message: string;
  scale: number;
  displayTimeMs: number;
  fadeInTimeMs: number;
  fadeOutTimeMs: number;
}
