import { UUID } from '@minecraft-js/uuid';
import { Packet } from '../Packet';

export class HologramRemovePacket extends Packet<HologramRemove> {
  public static id = 6;

  public write(data?: HologramRemove): void {
    this.data = data || this.data;

    this.buf.writeUUID(this.data.uuid);

    this.buf.finish();
  }

  public read(): HologramRemove {
    this.data = {
      uuid: this.buf.readUUID(),
    };

    return this.data;
  }
}

/**
 * Hologram remove packet
 * @see https://github.com/LunarClient/BukkitAPI-NetHandler/blob/master/src/main/java/com/lunarclient/bukkitapi/nethandler/client/LCPacketHologramRemove.java
 */
interface HologramRemove {
  /** UUID of the hologram */
  uuid: UUID;
}
