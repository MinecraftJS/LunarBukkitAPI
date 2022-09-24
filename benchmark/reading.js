const { LunarClientPacketWriter, LunarClientPacketReader } = require('../dist');
const { Suite } = require('benchmark');

const { packet } = new LunarClientPacketWriter('CooldownPacket', {
  id: 'pearl',
  durationMs: 15000,
  iconId: 368,
});

const packetHandler = new LunarClientPacketReader();

new Suite()
  .add('Reading', () => {
    packetHandler.read(packet.buf.buffer);
  })
  .on('complete', (event) => {
    console.log(event.target.toString());
  })
  .run();
