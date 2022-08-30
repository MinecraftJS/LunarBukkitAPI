import { UUID } from '@minecraft-js/uuid';
import { Packet } from '../Packet';

export class VoiceMutePacket extends Packet<VoiceMute> {
  public static id = 2;

  public write(data?: VoiceMute): void {
    this.data = data || this.data;

    this.buf.writeUUID(this.data.muting);
    this.buf.writeInt(this.data.volume);

    this.buf.finish();
  }

  public read(): VoiceMute {
    this.data = {
      muting: this.buf.readUUID(),
      volume: this.buf.readInt(),
    };

    return this.data;
  }
}

/**
 * Voice mute packet
 * @see https://github.com/LunarClient/BukkitAPI-NetHandler/blob/master/src/main/java/com/lunarclient/bukkitapi/nethandler/client/LCPacketVoiceMute.java
 */
interface VoiceMute {
  muting: UUID;
  volume: number;
}
