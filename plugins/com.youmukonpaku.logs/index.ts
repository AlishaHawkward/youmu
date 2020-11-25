import path from 'path';
import Mudb from '@youmukonpaku/mudb';
import { Handler } from '../../framework/types';

const dbPath = path.join(__dirname, 'logs');
const db = new Date().getTime().toString();
const Mu = new Mudb(dbPath);

// eslint-disable-next-line
try { Mu.createDatabase(db); } catch (e) {}
Mu.useDatabase(db);
// eslint-disable-next-line
try { Mu.createCollection('message'); } catch (e) {}
// eslint-disable-next-line
try { Mu.createCollection('request'); } catch (e) {}
// eslint-disable-next-line
try { Mu.createCollection('notice'); } catch (e) {}

const handler: Handler = {
  private: {
    allow: ['*'],
    deny: [],
  },
  group: {
    allow: ['*'],
    deny: [],
  },
  enable: true,
  onInit: () => {
    console.log('这里是魂魄妖梦，白玉楼的庭师！我将为你记录QQ群内发生的事情！');
  },
  onMessage: ({ data }) => {
    Mu.useCollection('message');
    Mu.addOneDocument(data);
    // console.log(JSON.stringify(data));
  },
  onRequest: ({ data }) => {
    Mu.useCollection('request');
    Mu.addOneDocument(data);
    // console.log(JSON.stringify(data));
  },
  onNotice: ({ data }) => {
    Mu.useCollection('notice');
    Mu.addOneDocument(data);
    // console.log(JSON.stringify(data));
  },
};

export default handler;
