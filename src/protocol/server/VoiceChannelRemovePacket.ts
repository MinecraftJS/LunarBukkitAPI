import { Packet } from '../Packet';

export class VoiceChannelRemovePacket extends Packet<VoiceChannelRemove> {
  public static id = 18;

  public write(data?: VoiceChannelRemove): void {
    this.data = data || this.data;

    this.buf.writeUUID(this.data.uuid);

    this.buf.finish();
  }

  public read(): VoiceChannelRemove {
    this.data = {
      uuid: this.buf.readUUID(),
    };

    return this.data;
  }
}

/**
 * Voice channel remove packet
 * @see https://github.com/LunarClient/BukkitAPI-NetHandler/blob/master/src/main/java/com/lunarclient/bukkitapi/nethandler/server/LCPacketVoiceChannelRemove.java
 */
interface VoiceChannelRemove {
  /** UUID of the channel */
  uuid: string;
}
