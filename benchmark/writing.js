const { LunarClientPacketWriter } = require('../dist');
const { Suite } = require('benchmark');

new Suite()
  .add('Writing', () => {
    new LunarClientPacketWriter('CooldownPacket', {
      id: 'pearl',
      durationMs: 15000,
      iconId: 368,
    });
  })
  .on('complete', (event) => {
    console.log(event.target.toString());
  })
  .run();
