import fs from 'fs';
import path from 'path';
import oicq from 'oicq';

import { Handler, Filter } from './types';

const defaultConfig = {
  private: {
    allow: ['*'],
    deny: [],
  },
  group: {
    allow: ['*'],
    deny: [],
  },
  enable: true,
  onInit: () => {},
  onMessage: () => {},
  onRequest: () => {},
  onNotice: () => {},
};

const filter = ({ data, hdl, cb }: Filter) => {
  if (
    (
      data.message_type === 'private' &&
      data.user_id &&
      (
        hdl.private.allow.includes('*') ||
        hdl.private.allow.includes((data.user_id).toString())
      ) &&
      !hdl.private.deny.includes(data.user_id.toString())
    ) || (
      data.message_type === 'group' &&
      data.group_id &&
      (
        hdl.group.allow.includes('*') ||
        hdl.group.allow.includes(data.group_id.toString())
      ) &&
      !hdl.group.deny.includes(data.group_id.toString())
    )
  ) {
    cb(hdl);
  }
};

const handler = (bot: oicq.Client) => {
  const hdlQueue: Handler[] = [];
  const msgDir = path.join(__dirname, '../plugins');
  if (fs.existsSync(msgDir)) {
    fs.readdirSync(msgDir).forEach((v) => {
      if (fs.statSync(path.join(msgDir, v)).isFile()) {
        return;
      }
      const msgHdl = {
        ...defaultConfig,
        ...require(path.join(msgDir, v)).default,
      };
      if (msgHdl.enable) {
        hdlQueue.push(msgHdl);
      }
    });
    for (let i = 0; i < hdlQueue.length; i++) {
      bot.on('system.online', () => {
        hdlQueue[i].onInit({ bot });
        bot.on('message', (data) => {
          filter({
            hdl: hdlQueue[i],
            cb: (hdl) => {
              hdl.onMessage({ data, bot });
            },
            data,
          });
        });
        bot.on('request', (data) => {
          filter({
            hdl: hdlQueue[i],
            cb: (hdl) => {
              hdl.onRequest({ data, bot });
            },
            data,
          });
        });
        bot.on('notice', (data) => {
          filter({
            hdl: hdlQueue[i],
            cb: (hdl) => {
              hdl.onNotice({ data, bot });
            },
            data,
          });
        });
      });
    }
  }
};

export default handler;
