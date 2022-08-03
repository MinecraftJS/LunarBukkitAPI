import { StaffMod } from '../../constants';
import { Packet } from '../Packet';

export class StaffModStatePacket extends Packet<StaffModState> {
  public static id = 12;

  public write(data?: StaffModState): void {
    this.data = data || this.data;

    this.buf.writeString(this.data.mod);
    this.buf.writeBoolean(this.data.state);

    this.buf.finish();
  }

  public read(): StaffModState {
    this.data = {
      mod: this.buf.readString() as StaffMod,
      state: this.buf.readBoolean(),
    };

    return this.data;
  }
}

/**
 * Staff mod state packet
 * @see https://github.com/LunarClient/BukkitAPI-NetHandler/blob/master/src/main/java/com/lunarclient/bukkitapi/nethandler/client/LCPacketStaffModState.java
 */
interface StaffModState {
  /** Name of the staff mod */
  mod: StaffMod;
  /** State to set */
  state: boolean;
}
