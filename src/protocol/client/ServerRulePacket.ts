import { ServerRuleEnum } from '../../constants';
import { Packet } from '../Packet';

export class ServerRulePacket extends Packet<ServerRule> {
  public static id = 10;

  public write(data?: ServerRule): void {
    this.data = data || this.data;

    this.buf.writeString(this.data.rule);
    this.buf.writeBoolean(this.data.booleanValue);
    this.buf.writeInt(this.data.intValue);
    this.buf.writeFloat(this.data.floatValue);
    this.buf.writeString(this.data.stringValue);

    this.buf.finish();
  }

  public read(): ServerRule {
    this.data = {
      rule: this.buf.readString() as ServerRuleEnum,
      booleanValue: this.buf.readBoolean(),
      intValue: this.buf.readInt(),
      floatValue: this.buf.readFloat(),
      stringValue: this.buf.readString(),
    };

    return this.data;
  }
}

/**
 * Server rule packet
 * @see https://github.com/LunarClient/BukkitAPI-NetHandler/blob/master/src/main/java/com/lunarclient/bukkitapi/nethandler/client/LCPacketServerRule.java
 */
type ServerRule = {
  rule: ServerRuleEnum;
  booleanValue?: boolean;
  intValue?: number;
  floatValue?: number;
  stringValue?: string;
};
