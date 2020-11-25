import { Handler } from '../../framework/types';

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
  },
  onMessage: () => {
  },
  onRequest: () => {
  },
  onNotice: () => {
  },
};

export default handler;
