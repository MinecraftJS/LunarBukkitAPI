import { Packet } from '../Packet';

export class VoiceChannelSwitchPacket extends Packet<VoiceChannelSwitch> {
  public static id = 1;

  public write(data?: VoiceChannelSwitch): void {
    this.data = data || this.data;

    this.buf.writeUUID(this.data.uuid);

    this.buf.finish();
  }

  public read(): VoiceChannelSwitch {
    this.data = {
      uuid: this.buf.readUUID(),
    };

    return this.data;
  }
}

/**
 * Voice channel switch packet
 * @see https://github.com/LunarClient/BukkitAPI-NetHandler/blob/master/src/main/java/com/lunarclient/bukkitapi/nethandler/client/LCPacketVoiceChannelSwitch.java
 */
interface VoiceChannelSwitch {
  /** Channel we're switching to */
  uuid: string;
}
