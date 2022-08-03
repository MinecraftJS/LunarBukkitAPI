import { Packet } from '../Packet';

export class WorldBorderPacket extends Packet<WorldBorder> {
  public static id = 20;

  public write(data?: WorldBorder): void {
    this.data = data || this.data;

    const isNotNull = this.data.id !== null;
    this.buf.writeBoolean(isNotNull);
    if (isNotNull) this.buf.writeString(this.data.id);

    this.buf.writeString(this.data.world);
    this.buf.writeBoolean(this.data.cancelsExit);
    this.buf.writeBoolean(this.data.canShrinkExpand);
    this.buf.writeInt(this.data.color);
    this.buf.writeDouble(this.data.minX);
    this.buf.writeDouble(this.data.minZ);
    this.buf.writeDouble(this.data.maxX);
    this.buf.writeDouble(this.data.maxZ);

    this.buf.finish();
  }

  public read(): WorldBorder {
    const isNotNull = this.buf.readBoolean();
    const id = isNotNull ? this.buf.readString() : null;

    this.data = {
      id,
      world: this.buf.readString(),
      cancelsExit: this.buf.readBoolean(),
      canShrinkExpand: this.buf.readBoolean(),
      color: this.buf.readInt(),
      minX: this.buf.readDouble(),
      minZ: this.buf.readDouble(),
      maxX: this.buf.readDouble(),
      maxZ: this.buf.readDouble(),
    };

    return this.data;
  }
}

/**
 * World border packet
 * @see https://github.com/LunarClient/BukkitAPI-NetHandler/blob/master/src/main/java/com/lunarclient/bukkitapi/nethandler/client/LCPacketWorldBorder.java
 */
interface WorldBorder {
  id: string;
  world: string;
  cancelsExit: boolean;
  canShrinkExpand: boolean;
  color: number;
  minX: number;
  minZ: number;
  maxX: number;
  maxZ: number;
}
