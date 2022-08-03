import deprecatePacket from '../../util/deprecatePacket';
import { Packet } from '../Packet';

class _BossBarPacket extends Packet<BossBar> {
  public static id = 28;

  public write(data?: BossBar): void {
    this.data = data || this.data;

    this.buf.writeVarInt(this.data.action);

    if (this.data.action === 0) {
      this.buf.writeString(this.data.text);
      this.buf.writeFloat(this.data.health);
    }

    this.buf.finish();
  }

  public read(): BossBar {
    const action = this.buf.readVarInt();

    this.data = { action, text: null, health: null };

    if (action === 0) {
      this.data.text = this.buf.readString();
      this.data.health = this.buf.readFloat();
    }

    return this.data;
  }
}

/** @deprecated Packet not handled by the official Lunar Client */
export const BossBarPacket: typeof _BossBarPacket =
  deprecatePacket(_BossBarPacket);

/**
 * Boss bar packet
 * @see https://github.com/LunarClient/BukkitAPI-NetHandler/blob/master/src/main/java/com/lunarclient/bukkitapi/nethandler/client/LCPacketBossBar.java
 */
interface BossBar {
  action: number;
  text: string;
  health: number;
}
