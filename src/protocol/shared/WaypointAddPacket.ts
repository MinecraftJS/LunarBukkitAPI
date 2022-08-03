import { Packet } from '../Packet';

export class WaypointAddPacket extends Packet<WaypointAdd> {
  public static id = 23;

  public write(data?: WaypointAdd): void {
    this.data = data || this.data;

    this.buf.writeString(this.data.name);
    this.buf.writeString(this.data.world);
    this.buf.writeInt(this.data.color);
    this.buf.writeInt(this.data.x);
    this.buf.writeInt(this.data.y);
    this.buf.writeInt(this.data.z);
    this.buf.writeBoolean(this.data.forced);
    this.buf.writeBoolean(this.data.visible);

    this.buf.finish();
  }

  public read(): WaypointAdd {
    this.data = {
      name: this.buf.readString(),
      world: this.buf.readString(),
      color: this.buf.readInt(),
      x: this.buf.readInt(),
      y: this.buf.readInt(),
      z: this.buf.readInt(),
      forced: this.buf.readBoolean(),
      visible: this.buf.readBoolean(),
    };

    return this.data;
  }
}

/**
 * Waypoint add packet
 * @see https://github.com/LunarClient/BukkitAPI-NetHandler/blob/master/src/main/java/com/lunarclient/bukkitapi/nethandler/shared/LCPacketWaypointAdd.java
 */
interface WaypointAdd {
  /** Name of the waypoint */
  name: string;
  /**
   * The world the waypoint is in (make it empty
   * to set the world the player is currently in)
   */
  world: string;
  /** X coordinate of the waypoint */
  x: number;
  /** Y coordinate of the waypoint */
  y: number;
  /** Z coordinate of the waypoint */
  z: number;
  /** Color of the waypoint */
  color: number;
  forced: boolean;
  /** If the waypoint is visible*/
  visible: boolean;
}
