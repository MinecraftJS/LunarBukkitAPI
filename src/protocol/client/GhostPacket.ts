import { UUID } from '@minecraft-js/uuid';
import deprecatePacket from '../../util/deprecatePacket';
import { Packet } from '../Packet';

class _GhostPacket extends Packet<Ghost> {
  public static id = 25;

  public write(data?: Ghost): void {
    this.data = data || this.data;

    this.buf.writeVarInt(this.data.addGhostList.length);
    for (const ghost of this.data.addGhostList) this.buf.writeUUID(ghost);

    this.buf.writeVarInt(this.data.removeGhostList.length);
    for (const ghost of this.data.removeGhostList) this.buf.writeUUID(ghost);

    this.buf.finish();
  }

  public read(): Ghost {
    const addGhostListLength = this.buf.readVarInt();
    const addGhostList: UUID[] = [];
    for (let i = 0; i < addGhostListLength; i++)
      addGhostList.push(this.buf.readUUID());

    const removeGhostListLength = this.buf.readVarInt();
    const removeGhostList: UUID[] = [];
    for (let i = 0; i < removeGhostListLength; i++)
      removeGhostList.push(this.buf.readUUID());

    this.data = { addGhostList, removeGhostList };

    return this.data;
  }
}

/** @deprecated Packet not handled by the official Lunar Client */
export const GhostPacket = deprecatePacket(_GhostPacket);

/**
 * Ghost packet
 * @see https://github.com/LunarClient/BukkitAPI-NetHandler/blob/master/src/main/java/com/lunarclient/bukkitapi/nethandler/client/LCPacketGhost.java
 */
interface Ghost {
  addGhostList: UUID[];
  removeGhostList: UUID[];
}
