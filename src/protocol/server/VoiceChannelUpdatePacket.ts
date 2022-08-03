import { VoiceChannelUpdateStatus } from '../../constants';
import deprecatePacket from '../../util/deprecatePacket';
import { Packet } from '../Packet';

class _VoiceChannelUpdatePacket extends Packet<VoiceChannelUpdate> {
  public static id = 19;

  public write(data?: VoiceChannelUpdate): void {
    this.data = data || this.data;

    this.buf.writeInt(this.data.status);
    this.buf.writeUUID(this.data.channelUuid);
    this.buf.writeUUID(this.data.uuid);
    this.buf.writeString(this.data.name);

    this.buf.finish();
  }

  public read(): VoiceChannelUpdate {
    this.data = {
      status: this.buf.readInt(),
      channelUuid: this.buf.readUUID(),
      uuid: this.buf.readUUID(),
      name: this.buf.readString(),
    };

    return this.data;
  }
}

/** @deprecated Packet not handled by the official Lunar Client */
export const VoiceChannelUpdatePacket = deprecatePacket(
  _VoiceChannelUpdatePacket
);

/**
 * Voice channel update packet
 * @see https://github.com/LunarClient/BukkitAPI-NetHandler/blob/master/src/main/java/com/lunarclient/bukkitapi/nethandler/server/LCPacketVoiceChannelUpdate.java
 */
interface VoiceChannelUpdate {
  /** Status of the channel */
  status: VoiceChannelUpdateStatus;
  /** UUID of the channel */
  channelUuid: string;
  /** UUID of the player */
  uuid: string;
  /** Name of the player */
  name: string;
}
