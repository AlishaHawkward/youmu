import oicq from 'oicq';

export interface Handler {
  private: {
    allow: string[];
    deny: string[];
  };
  group: {
    allow: string[];
    deny: string[];
  };
  enable: boolean;
  onInit: {
    (res: {
      bot: oicq.Client;
    }): void;
  };
  onMessage: {
    (res: {
      data: oicq.EventData;
      bot: oicq.Client;
    }): void;
  };
  onRequest: {
    (res: {
      data: oicq.EventData;
      bot: oicq.Client;
    }): void;
  };
  onNotice: {
    (res: {
      data: oicq.EventData;
      bot: oicq.Client;
    }): void;
  };
}

export interface Filter {
  data: oicq.EventData;
  hdl: Handler;
  cb: {
    (hdl: Handler): void;
  };
}
