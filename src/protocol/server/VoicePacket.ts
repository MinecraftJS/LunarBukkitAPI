import { UUID } from '@minecraft-js/uuid';
import deprecatePacket from '../../util/deprecatePacket';
import { Packet } from '../Packet';

class _VoicePacket extends Packet<Voice> {
  public static id = 16;

  public write(data?: Voice): void {
    this.data = data || this.data;

    this.buf.writeVarInt(data.uuids.length);
    for (const uuid of this.data.uuids) this.buf.writeUUID(uuid);

    this.buf.plugins.lunar.writeBlob(this.data.data);

    this.buf.finish();
  }

  public read(): Voice {
    const uuidsLength = this.buf.readVarInt();
    const uuids: UUID[] = [];
    for (let i = 0; i < uuidsLength; i++) uuids.push(this.buf.readUUID());

    this.data = {
      uuids,
      data: this.buf.plugins.lunar.readBlob(),
    };

    return this.data;
  }
}

/** @deprecated Packet not handled by the official Lunar Client */
export const VoicePacket = deprecatePacket(_VoicePacket);

/**
 * Voice packet
 * @see https://github.com/LunarClient/BukkitAPI-NetHandler/blob/master/src/main/java/com/lunarclient/bukkitapi/nethandler/server/LCPacketVoice.java
 */
interface Voice {
  /** The UUID of all the senders */
  uuids: UUID[];
  /** The "smashed" bytes of all the voice */
  data: number[];
}
