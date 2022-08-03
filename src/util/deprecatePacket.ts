import { deprecate } from 'node:util';

/**
 * Deprecate a packet
 * @param packet Packet to deprecate
 * @returns The deprecated packet
 */
export default function deprecatePacket<T extends { new (): unknown }>(
  packet: T
): T {
  return deprecate(
    packet,
    `Packet ${packet.name} not handled by the official Lunar Client`,
    `DEP-${packet.name}`
  );
}
