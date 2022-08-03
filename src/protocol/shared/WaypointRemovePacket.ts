import { Packet } from '../Packet';

export class WaypointRemovePacket extends Packet<WaypointRemove> {
  public static id = 24;

  public write(data?: WaypointRemove): void {
    this.data = data || this.data;

    this.buf.writeString(this.data.name);
    this.buf.writeString(this.data.world);

    this.buf.finish();
  }

  public read(): WaypointRemove {
    this.data = {
      name: this.buf.readString(),
      world: this.buf.readString(),
    };

    return this.data;
  }
}

/**
 * Waypoint remove packet
 * @see https://github.com/LunarClient/BukkitAPI-NetHandler/blob/master/src/main/java/com/lunarclient/bukkitapi/nethandler/shared/LCPacketWaypointRemove.java
 */
interface WaypointRemove {
  /** Name of the waypoint */
  name: string;
  /**
   * The world the waypoint is in (make it empty
   * to set the world the player is currently in)
   */
  world: string;
}
