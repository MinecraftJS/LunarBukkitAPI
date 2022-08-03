import { Packet } from '../Packet';

export class VoiceChannelPacket extends Packet<VoiceChannel> {
  public static id = 17;

  public write(data?: VoiceChannel): void {
    this.data = data || this.data;

    this.buf.writeUUID(this.data.uuid);
    this.buf.writeString(this.data.name);

    this.buf.plugins.lunar.writeMap(this.data.players);
    this.buf.plugins.lunar.writeMap(this.data.listening);

    this.buf.finish();
  }

  public read(): VoiceChannel {
    this.data = {
      uuid: this.buf.readUUID(),
      name: this.buf.readString(),
      players: this.buf.plugins.lunar.readMap(),
      listening: this.buf.plugins.lunar.readMap(),
    };

    return this.data;
  }
}

/**
 * Voice channel packet
 * @see https://github.com/LunarClient/BukkitAPI-NetHandler/blob/master/src/main/java/com/lunarclient/bukkitapi/nethandler/server/LCPacketVoiceChannel.java
 */
interface VoiceChannel {
  /** UUID of the channel */
  uuid: string;
  /** Name of the channel */
  name: string;
  players: { [key: string]: string };
  listening: { [key: string]: string };
}
