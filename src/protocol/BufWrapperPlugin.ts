import { BufWrapper } from '@minecraft-js/bufwrapper';

type MapResolvable = { [key: string]: string };

/**
 * Write a map to the buffer
 *
 * An object with an UUID as key and a
 * string as value is considered a map.
 * @param value Value to write to the buffer
 * @example
 * ```javascript
 * const buf = new BufWrapper(null, {
 *   plugins: { lunar: BufWrapperLunarPlugin }
 * });
 *
 * const map = {
 *   '827f8c48-cdb2-4105-af39-df5a64f93490': 'Hello World!'
 * };
 *
 * buf.plugins.lunar.writeMap(map);
 * ```
 */
export function writeMap(this: BufWrapper, value: MapResolvable): void {
  const keys = Object.keys(value);

  this.writeVarInt(keys.length);
  for (const key of keys) {
    this.writeUUID(key);
    this.writeString(value[key]);
  }
}

/**
 * Read a map from the buffer
 *
 * An object with an UUID as key and a
 * string as value is considered a map.
 * @returns The read map
 * @example
 * ```javascript
 * // `data` is the source buffer
 * const buf = new BufWrapper(data, {
 *   plugins: { lunar: BufWrapperLunarPlugin }
 * });
 *
 * buf.plugins.lunar.readMap(map); // { ... }
 * ```
 */
export function readMap(this: BufWrapper): MapResolvable {
  const length = this.readVarInt();
  const map: MapResolvable = {};

  for (let i = 0; i < length; i++) map[this.readUUID()] = this.readString();

  return map;
}

/**
 * Write a blobl to the buffer
 *
 * An array of bytes is considered a blob.
 * @param value Value to write to the buffer
 * @example
 * ```javascript
 * const buf = new BufWrapper(null, {
 *   plugins: { lunar: BufWrapperLunarPlugin }
 * });
 *
 * buf.plugins.lunar.writeBlob([4, 150, 254, 6]);
 * ```
 */
export function writeBlob(this: BufWrapper, value: number[]): void {
  this.writeShort(value.length);
  this.writeBytes(value);
}

/**
 * Read a blob from the buffer
 *
 * An array of bytes is considered a blob.
 * @returns The read blob
 * @example
 * ```javascript
 * // `data` is the source buffer
 * const buf = new BufWrapper(data, {
 *   plugins: { lunar: BufWrapperLunarPlugin }
 * });
 *
 * buf.plugins.lunar.readBlob(map); // [ ... ]
 * ```
 */
export function readBlob(this: BufWrapper): number[] {
  const length = this.readShort();
  return [...this.readBytes(length)];
}
