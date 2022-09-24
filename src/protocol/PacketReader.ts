import { BufWrapper } from '@minecraft-js/bufwrapper';
import { EventEmitter } from 'node:events';
import TypedEmitter from 'typed-emitter';
import * as protocol from '.';
import { LunarClientPluginChannel } from '../constants';
import * as BufWrapperLunarPlugin from './BufWrapperPlugin';
import { TransferPacket } from './client/TransferPacket';

type LunarClientPacketReaderEvents = {
  [key in keyof typeof protocol]: (
    packet: InstanceType<typeof protocol[key]>
  ) => void;
};

const events = Object.keys(protocol) as (keyof typeof protocol)[];
const packets = Object.values(protocol);

/**
 * Instantiate a new PacketHandler class.
 * This class extends EventEmitter and for
 * each successfuly handled packet the event
 * emitter will emit an event. If a `CooldownPacket`
 * is received, an event with name `CooldownPacket`
 * is emitted.
 *
 * @example
 * ```javascript
 * const packetReader = new LunarClientPacketReader();
 *
 * // Call PacketReader#read with
 * // the buffer everytime you receive
 * // a packet
 *
 * packetReader.on('CooldownPacket', ({ data }) => {
 *   // Do something with data
 * });
 * ```
 */
export default class LunarClientPacketReader extends (EventEmitter as new () => TypedEmitter<LunarClientPacketReaderEvents>) {
  /**
   * Read a packet, if everything is successful
   * an event will be emited with the content of
   * the packet
   * @param buffer The raw packet to read
   * @param channel The plugin channel the packet comes from. Defauts to `LunarClientPacketReader.NEW`
   */
  public read(buffer: Buffer, channel?: LunarClientPluginChannel): void {
    channel = channel ?? LunarClientPluginChannel.NEW;

    const buf = new BufWrapper(buffer, {
      plugins: { lunar: BufWrapperLunarPlugin },
    });

    if (channel === LunarClientPluginChannel.TRANSFER) {
      const packet = new TransferPacket(buf);
      packet.read();
      return void this.emit('TransferPacket', packet);
    }

    const id = buf.readVarInt();
    const Packet = packets.find((p) => p.id === id);
    if (!Packet) throw new Error(`Unknown packet (id=${id})`);

    const packet = new Packet(buf);
    packet.read();

    const event = events.find((key) => packet[key] === Packet);
    // @ts-ignore
    this.emit(event, packet);
  }
}
