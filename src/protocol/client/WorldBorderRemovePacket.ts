import { Packet } from '../Packet';

export class WorldBorderRemovePacket extends Packet<WorldBorderRemove> {
  public static id = 21;

  public write(data?: WorldBorderRemove): void {
    this.data = data || this.data;

    this.buf.writeString(this.data.id);

    this.buf.finish();
  }

  public read(): WorldBorderRemove {
    this.data = {
      id: this.buf.readString(),
    };

    return this.data;
  }
}

/**
 * World border remove packet
 * @see https://github.com/LunarClient/BukkitAPI-NetHandler/blob/master/src/main/java/com/lunarclient/bukkitapi/nethandler/client/LCPacketWorldBorderRemove.java
 */
interface WorldBorderRemove {
  /** ID of the world border to remove */
  id: string;
}
