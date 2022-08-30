const { LunarClientPacketBuilder } = require('../dist');
const { Suite } = require('benchmark');

new Suite()
  .add('Writing', () => {
    new LunarClientPacketBuilder('CooldownPacket', {
      id: 'pearl',
      durationMs: 15000,
      iconId: 368,
    });
  })
  .on('complete', (event) => {
    console.log(event.target.toString());
  })
  .run();
