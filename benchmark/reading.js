const {
  LunarClientPacketBuilder,
  LunarClientPacketHandler,
} = require('../dist');
const { Suite } = require('benchmark');

const { packet } = new LunarClientPacketBuilder('CooldownPacket', {
  id: 'pearl',
  durationMs: 15000,
  iconId: 368,
});

const packetHandler = new LunarClientPacketHandler();

new Suite()
  .add('Reading', () => {
    packetHandler.handle(packet.buf.buffer);
  })
  .on('complete', (event) => {
    console.log(event.target.toString());
  })
  .run();
