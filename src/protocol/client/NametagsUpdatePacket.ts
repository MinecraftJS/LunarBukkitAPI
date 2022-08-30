import { UUID } from '@minecraft-js/uuid';
import { Packet } from '../Packet';

export class NametagsUpdatePacket extends Packet<NametagsUpdate> {
  public static id = 8;

  public write(data?: NametagsUpdate): void {
    this.data = data || this.data;

    const isNull = this.data.playersMap === null;
    this.buf.writeVarInt(isNull ? -1 : this.data.playersMap.length);

    if (!isNull)
      for (const player of this.data.playersMap) {
        this.buf.writeUUID(player.uuid);

        this.buf.writeVarInt(player.tags.length);
        for (const tag of player.tags) this.buf.writeString(tag);
      }

    this.buf.finish();
  }

  public read(): NametagsUpdate {
    const playersMapLength = this.buf.readVarInt();

    const isNull = playersMapLength === -1;
    const playersMap: NametagsUpdate['playersMap'] = isNull ? null : [];

    if (!isNull)
      for (let i = 0; i < playersMapLength; i++) {
        const uuid = this.buf.readUUID();

        const tagsLength = this.buf.readVarInt();
        const tags: string[] = [];
        for (let i = 0; i < tagsLength; i++) tags.push(this.buf.readString());

        playersMap.push({ uuid, tags });
      }

    return this.data;
  }
}

/**
 * Nametags update packet
 * @see https://github.com/LunarClient/BukkitAPI-NetHandler/blob/master/src/main/java/com/lunarclient/bukkitapi/nethandler/client/LCPacketNametagsUpdate.java
 */
interface NametagsUpdate {
  playersMap: {
    uuid: UUID;
    tags: string[];
  }[];
}
