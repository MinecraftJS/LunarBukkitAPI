import deprecatePacket from '../../util/deprecatePacket';
import { Packet } from '../Packet';

class _ServerUpdatePacket extends Packet<ServerUpdate> {
  public static id = 11;

  public write(data?: ServerUpdate): void {
    this.data = data || this.data;

    this.buf.writeString(this.data.server);

    this.buf.finish();
  }

  public read(): ServerUpdate {
    this.data = {
      server: this.buf.readString(),
    };

    return this.data;
  }
}

/** @deprecated Packet not handled by the official Lunar Client */
export const ServerUpdatePacket = deprecatePacket(_ServerUpdatePacket);

/**
 * Server update packet
 * @see https://github.com/LunarClient/BukkitAPI-NetHandler/blob/master/src/main/java/com/lunarclient/bukkitapi/nethandler/client/LCPacketServerUpdate.java
 */
interface ServerUpdate {
  server: string;
}
