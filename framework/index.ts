import path from 'path';
import oicq from 'oicq';

import handler from './handler';

import botInfo from '../configs/default.conf';

export let bot: oicq.Client;

const initial = () => {
  bot = oicq.createClient(botInfo.id, {
    platform: botInfo.pl,
    log_level: 'warn',
    data_dir: path.join(__dirname, '../data'),
  });

  bot.on('system.login.captcha', (data) => {
    console.log(`图片验证码Base64：${data.image?.toString('base64')}`);
    console.log('您可以复制以上代码在这里进行查看：http://tool.chinaz.com/tools/imgtobase/');
    console.log('请输入图片验证码：');
    process.stdin.once('data', (input) => {
      bot.captchaLogin(input.toString());
    });
  });

  bot.on('system.login.device', (data) => {
    console.log(`设备验证地址：${data.url}`);
    console.log('验证完以后按回车继续！');
    process.stdin.once('data', () => {
      bot.logout();
      initial();
    });
  });

  bot.on('system.login.error', (err) => {
    console.log(err);
    bot.logout();
  });

  bot.on('system.offline.network', () => {
    console.log('网络异常，系统将在30S后尝试再次登入！');
    setTimeout(() => {
      bot.logout();
      initial();
    }, 30000);
  });

  bot.on('system.offline.frozen', () => {
    console.log('账号被冻结！');
    bot.logout();
  });

  bot.on('system.offline.kickoff', () => {
    console.log('账号在其他设备登入！');
    bot.logout();
  });

  bot.on('system.offline.device', () => {
    console.log('开启设备锁，需要重新验证！');
    bot.logout();
    initial();
  });

  bot.on('system.offline.unknown', (err) => {
    console.log(`${err }，将在30S后尝试再次登入！`);
    setTimeout(() => {
      bot.logout();
      initial();
    }, 30000);
  });

  handler(bot);

  bot.login(botInfo.pw);
};

initial();
