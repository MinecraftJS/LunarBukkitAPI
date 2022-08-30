import { UUID } from '@minecraft-js/uuid';
import { Packet } from '../Packet';

export class NametagsOverridePacket extends Packet<NametagsOverride> {
  public static id = 7;

  public write(data?: NametagsOverride): void {
    this.data = data || this.data;

    this.buf.writeUUID(this.data.player);

    const isNotNull = this.data.tags !== null;
    this.buf.writeBoolean(isNotNull);

    if (!isNotNull) {
      this.buf.writeVarInt(this.data.tags.length);

      for (const tag of this.data.tags) this.buf.writeString(tag);
    }

    this.buf.finish();
  }

  public read(): NametagsOverride {
    const player = this.buf.readUUID();

    const isNotNull = this.buf.readBoolean();
    const tags: string[] = isNotNull ? [] : null;
    if (isNotNull) {
      const tagsLength = this.buf.readVarInt();
      for (let i = 0; i < tagsLength; i++) tags.push(this.buf.readString());
    }

    this.data = {
      player,
      tags,
    };

    return this.data;
  }
}

/**
 * Nametags override packet
 * @see https://github.com/LunarClient/BukkitAPI-NetHandler/blob/master/src/main/java/com/lunarclient/bukkitapi/nethandler/client/LCPacketNametagsOverride.java
 */
interface NametagsOverride {
  /** UUID of the player */
  player: UUID;
  tags: string[];
}
