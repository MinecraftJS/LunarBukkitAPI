import { NotificationLevel } from '../../constants';
import deprecatePacket from '../../util/deprecatePacket';
import { Packet } from '../Packet';

class _NotificationPacket extends Packet<Notification> {
  public static id = 9;

  public write(data?: Notification): void {
    this.data = data || this.data;

    this.buf.writeString(this.data.message);
    this.buf.writeLong(this.data.durationMs);
    this.buf.writeString(this.data.level);

    this.buf.finish();
  }

  public read(): Notification {
    this.data = {
      message: this.buf.readString(),
      durationMs: this.buf.readLong(),
      level: this.buf.readString() as Notification['level'],
    };

    return this.data;
  }
}

/** @deprecated Packet not handled by the official Lunar Client */
export const NotificationPacket = deprecatePacket(_NotificationPacket);

/**
 * Notification packet
 * @see https://github.com/LunarClient/BukkitAPI-NetHandler/blob/master/src/main/java/com/lunarclient/bukkitapi/nethandler/client/LCPacketNotification.java
 */
interface Notification {
  message: string;
  durationMs: number;
  level: NotificationLevel;
}
