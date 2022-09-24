import { BufWrapper } from '@minecraft-js/bufwrapper';
import { Packet } from '../Packet';

export class TransferPacket extends Packet<Transfer> {
  public write(data?: Transfer): void {
    this.data = data || this.data;

    if (this.data.servers.length === 1) {
      this.buf.writeBytes(Buffer.from([0x00]));
      writeString(this.buf, this.data.servers[0]);
    } else {
      this.buf.writeBytes(Buffer.from([0x02]));
      this.buf.writeInt(this.data.servers.length);
      for (const server of this.data.servers) writeString(this.buf, server);
    }

    this.buf.finish();
  }

  public read(): Transfer {
    const type = this.buf.readBytes(1)[0];

    if (type === 0)
      this.data = {
        servers: [readString(this.buf)],
      };

    if (type === 2) {
      const length = this.buf.readInt();
      const servers: string[] = [];

      if (length > 10) throw new Error('Too many servers received.');
      for (let i = 0; i < length; i++) servers.push(readString(this.buf));

      this.data = { servers };
    }

    return this.data;
  }
}

function writeString(buf: BufWrapper, value: string): void {
  buf.writeInt(Buffer.byteLength(value));
  buf.writeBytes(Buffer.from(value));
}

function readString(buf: BufWrapper): string {
  const length = buf.readInt();
  if (length > 1024)
    throw new Error(
      `The received encoded string buffer length is longer than maximum allowed (${length} > 1024)`
    );

  return buf.readBytes(length).toString();
}

/**
 * Tranfer packet
 */
interface Transfer {
  servers: string[];
}
