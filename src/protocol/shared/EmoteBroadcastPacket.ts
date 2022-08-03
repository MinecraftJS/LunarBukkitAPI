import deprecatePacket from '../../util/deprecatePacket';
import { Packet } from '../Packet';

class _EmoteBroadcastPacket extends Packet<EmoteBroadcast> {
  public static id = 26;

  public write(data?: EmoteBroadcast): void {
    this.data = data || this.data;

    this.buf.writeUUID(data.uuid);
    this.buf.writeInt(data.emoteId);

    this.buf.finish();
  }

  public read(): EmoteBroadcast {
    this.data = {
      uuid: this.buf.readUUID(),
      emoteId: this.buf.readInt(),
    };

    return this.data;
  }
}

/** @deprecated Packet not handled by the official Lunar Client */
export const EmoteBroadcastPacket = deprecatePacket(_EmoteBroadcastPacket);

/**
 * Emote broadcast packet
 * @see https://github.com/LunarClient/BukkitAPI-NetHandler/blob/master/src/main/java/com/lunarclient/bukkitapi/nethandler/shared/LCPacketEmoteBroadcast.java
 */
interface EmoteBroadcast {
  /** User doing the emote */
  uuid: string;
  /** Emote they are doing */
  emoteId: number;
}
