# LunarBukkitAPI

![GitHub Workflow Status](https://img.shields.io/github/workflow/status/MinecraftJS/LunarBukkitAPI/Build?style=for-the-badge)
![GitHub](https://img.shields.io/github/license/MinecraftJS/LunarBukkitAPI?style=for-the-badge)
![npm (scoped)](https://img.shields.io/npm/v/@minecraft-js/lunarbukkitapi?style=for-the-badge)

Defines the Lunar Client Bukkit protocol

# Documentation

## Installation

Install the package:

```bash
$ npm install @minecraft-js/lunarbukkitapi
```

And then import it in your JavaScript/TypeScript file

```ts
const LunarClient = require('@minecraft-js/lunarbukkitapi'); // CommonJS

import * as LunarClient from '@minecraft-js/lunarbukkitapi'; // ES6
```

## High level API

This library comes with a high level API for a player which means you can easily set cooldowns, set waypoints without even touching any packets!

For now since there's no MinecraftJS client/server library you need to set your own
packet sending/receiving handling.

At the time of writing, the biggest client/server library is [PrismarineJS](https://github.com/PrismarineJS/node-minecraft-protocol)
and here is a simple example with that library

```js
// PrismarineJS
const mc = require('minecraft-protocol');
const server = mc.createServer({ ... });

server.on('login', (client) => {
  ...

  let playerChannel = '';
  const lunarPlayer = new LunarClient.LunarClientPlayer({
    customHandling: {
      registerPluginChannel(channel) {
        playerChannel = channel;

        // PrismarineJS way of sending packets
        client.write('custom_payload', {
          channel: 'REGISTER',
          data: Buffer.from(channel + '\0')
        });
      },

      sendPacket(buffer) {
        // PrismarineJS way of sending packets
        client.write('custom_payload', {
          channel: playerChannel,
          data: buffer
        })
      }
    }
  });

  // Sending a cooldown
  // with id of `pearl`
  // for 15s and an ender
  // pearl as item (368)
  lunarPlayer.addCooldown('pearl', 15000, 368);
});
```
