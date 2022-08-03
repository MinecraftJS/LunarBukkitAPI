import { Packet } from '../Packet';

export class WorldBorderCreateNewPacket extends Packet<WorldBorderCreateNew> {
  public static id = 29;

  public write(data?: WorldBorderCreateNew): void {
    this.data = data || this.data;

    const isNotNull = this.data.id !== null;
    this.buf.writeBoolean(isNotNull);
    if (isNotNull) this.buf.writeString(this.data.id);

    this.buf.writeString(this.data.world);
    this.buf.writeBoolean(this.data.cancelsEntry);
    this.buf.writeBoolean(this.data.cancelsExit);
    this.buf.writeBoolean(this.data.canShrinkExpand);
    this.buf.writeInt(this.data.color);
    this.buf.writeDouble(this.data.minX);
    this.buf.writeDouble(this.data.minZ);
    this.buf.writeDouble(this.data.maxX);
    this.buf.writeDouble(this.data.maxZ);

    this.buf.finish();
  }

  public read(): WorldBorderCreateNew {
    const isNotNull = this.buf.readBoolean();
    const id = isNotNull ? this.buf.readString() : null;

    this.data = {
      id,
      world: this.buf.readString(),
      cancelsEntry: this.buf.readBoolean(),
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
 * World border create new packet
 * @see https://github.com/LunarClient/BukkitAPI-NetHandler/blob/master/src/main/java/com/lunarclient/bukkitapi/nethandler/client/LCPacketWorldBorderCreateNew.java
 */
interface WorldBorderCreateNew {
  id: string;
  world: string;
  cancelsEntry: boolean;
  cancelsExit: boolean;
  canShrinkExpand: boolean;
  color: number;
  minX: number;
  minZ: number;
  maxX: number;
  maxZ: number;
}
