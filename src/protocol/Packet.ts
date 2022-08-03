import { BufWrapper } from '@minecraft-js/bufwrapper';
import * as BufWrapperLunarPlugin from './BufWrapperPlugin';

/** Class representing a packet */
export class Packet<T> {
  /** ID of the packet */
  public static id: number;

  /** BufWrapper instance that wraps the buffer for this packet */
  public buf: BufWrapper<{ lunar: typeof BufWrapperLunarPlugin }>;
  /** Data associated to this packet */
  public data: T;

  /**
   * Read or write a packet
   * @param buf Buffer to create the packet from, can be `undefined` if you are building a packet
   */
  public constructor(
    buf?: BufWrapper<{ lunar: typeof BufWrapperLunarPlugin }>
  ) {
    this.buf =
      buf ||
      new BufWrapper(null, {
        oneConcat: true,
        plugins: { lunar: BufWrapperLunarPlugin },
      });
  }

  /**
   * Write the data to the packet
   * @param data Data to write into the packet,
   * if not present it'll use the `data` property.
   * If the `data` parameter is present, it will
   * override the `data` property.
   */
  public write(data?: T): void {
    throw new Error(
      `${
        Object.getPrototypeOf(this).constructor.name
      }#write is not implemented!`
    );
  }

  /**
   * Read the packet content
   * @returns The read content of the packet
   */
  public read(): T {
    throw new Error(
      `${Object.getPrototypeOf(this).constructor.name}#read is not implemented!`
    );
  }
}
