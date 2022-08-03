import { BufWrapper } from '@minecraft-js/bufwrapper';
import { EventEmitter } from 'node:events';
import TypedEmitter from 'typed-emitter';
import * as protocol from '.';
import * as BufWrapperLunarPlugin from './BufWrapperPlugin';

type LunarClientPacketHandlerEvents = {
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
 * const packetHandler = new PacketHandler();
 *
 * // Call PacketHandler#handle with
 * // the buffer everytime you receive
 * // a packet
 *
 * packetHandler.on('CooldownPacket', ({ data }) => {
 *   // Do something with data
 * });
 * ```
 */
export default class LunarClientPacketHandler extends (EventEmitter as new () => TypedEmitter<LunarClientPacketHandlerEvents>) {
  /**
   * Handle a packet, if everything is successful
   * an event will be emited with the content of
   * the packet
   */
  public handle(buffer: Buffer): void {
    const buf = new BufWrapper(buffer, {
      plugins: { lunar: BufWrapperLunarPlugin },
    });

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
