import { Packet } from '../Packet';

export class ClientVoicePacket extends Packet<ClientVoice> {
  public static id = 0;

  public write(data?: ClientVoice): void {
    this.data = data || this.data;

    this.buf.plugins.lunar.writeBlob(this.data.data);

    this.buf.finish();
  }

  public read(): ClientVoice {
    this.data = { data: this.buf.plugins.lunar.readBlob() };

    return this.data;
  }
}

/**
 * Client voice packet
 * @see https://github.com/LunarClient/BukkitAPI-NetHandler/blob/master/src/main/java/com/lunarclient/bukkitapi/nethandler/client/LCPacketClientVoice.java
 */
interface ClientVoice {
  /** Array of bytes (`0-255`) */
  data: number[];
}
