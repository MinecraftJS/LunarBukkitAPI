import { LunarMod } from '../../constants';
import { Packet } from '../Packet';

export class ModSettingsPacket extends Packet<ModSettings> {
  public static id = 31;

  public write(data?: ModSettings): void {
    this.data = data || this.data;

    this.buf.writeString(JSON.stringify(this.data.settings));

    this.buf.finish();
  }

  public read(): ModSettings {
    this.data = { settings: JSON.parse(this.buf.readString()) };

    return this.data;
  }
}

/**
 * Mod settings packet
 * @see https://github.com/LunarClient/BukkitAPI-NetHandler/blob/master/src/main/java/com/lunarclient/bukkitapi/nethandler/client/LCPacketModSettings.java
 */
interface ModSettings {
  settings: {
    [key in LunarMod]?: {
      enabled: boolean;
      properties: { [key: string]: unknown };
    };
  };
}
