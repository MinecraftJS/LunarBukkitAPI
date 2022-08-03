import { Packet } from '../Packet';

export class UpdateWorldPacket extends Packet<UpdateWorld> {
  public static id = 15;

  public write(data?: UpdateWorld): void {
    this.data = data || this.data;

    this.buf.writeString(this.data.world);

    this.buf.finish();
  }

  public read(): UpdateWorld {
    this.data = { world: this.buf.readString() };

    return this.data;
  }
}

/**
 * Update world packet
 * @see https://github.com/LunarClient/BukkitAPI-NetHandler/blob/master/src/main/java/com/lunarclient/bukkitapi/nethandler/client/LCPacketUpdateWorld.java
 */
interface UpdateWorld {
  world: string;
}
