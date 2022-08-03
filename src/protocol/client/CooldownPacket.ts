import { Packet } from '../Packet';

export class CooldownPacket extends Packet<Cooldown> {
  public static id = 3;

  public write(data?: Cooldown): void {
    this.data = data || this.data;

    this.buf.writeString(this.data.id);
    this.buf.writeLong(this.data.durationMs);
    this.buf.writeInt(this.data.iconId);

    this.buf.finish();
  }

  public read(): Cooldown {
    this.data = {
      id: this.buf.readString(),
      durationMs: this.buf.readLong(),
      iconId: this.buf.readInt(),
    };

    return this.data;
  }
}

/**
 * Cooldown packet
 * @see https://github.com/LunarClient/BukkitAPI-NetHandler/blob/master/src/main/java/com/lunarclient/bukkitapi/nethandler/client/LCPacketCooldown.java
 */
interface Cooldown {
  /** Unique ID to put to the cooldown (used to remove the cooldown later if nessecary) */
  id: string;
  /** Time, in milliseconds, the cooldown should stay */
  durationMs: number;
  /**
   * The block/item displayed in the HUD
   * @see https://minecraft-ids.grahamedgecombe.com/
   */
  iconId: number;
}
