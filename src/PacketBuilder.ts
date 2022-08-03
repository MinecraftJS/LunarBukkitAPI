import { BufWrapper } from '@minecraft-js/bufwrapper';
import { BufWrapperLunarPlugin } from '.';
import * as protocol from './protocol';

/**
 * PacketBuiler class, used to easily build packets.
 * @example
 * ```javascript
 * const { packet } = new PacketBuilder('CooldownPacket', {
 *   id: 'pearl',
 *   durationMs: 5000,
 *   iconId: 368
 * });
 *
 * // Do something with `packet`
 * ```
 */
export default class PacketBuilder<T extends keyof typeof protocol> {
  public packet: InstanceType<typeof protocol[T]>;

  /**
   * PacketBuiler class, used to easily build packets.
   * @param packet Name of the packet to build
   * @param data Data of the packet
   * @example
   * ```javascript
   * const { packet } = new PacketBuilder('CooldownPacket', {
   *   id: 'pearl',
   *   durationMs: 5000,
   *   iconId: 368
   * });
   *
   * // Do something with `packet`
   * ```
   */
  public constructor(
    packet: T,
    data: InstanceType<typeof protocol[T]>['data']
  ) {
    const Packet = protocol[packet];

    const buf = new BufWrapper(null, {
      oneConcat: true,
      plugins: { lunar: BufWrapperLunarPlugin },
    });
    buf.writeVarInt(Packet.id);

    this.packet = new Packet(buf) as InstanceType<typeof protocol[T]>;
    // @ts-ignore TODO: type this so it's not weird
    this.packet.write(data);
  }
}
