import io from 'socket.io-client';

import { CandleDataSet } from './candles';
import { Scene } from './scene';

const scene = initialize();
fetchHistory().then(data => {
  if (data.s !== 'ok') {
    return;
  }

  const {
    t: timestamps,
    o: openPrices,
    h: maxPrices,
    l: minPrices,
    c: closePrices
  } = data;

  let dataItems = timestamps.map((timestamp, i) => {
    return [
      timestamp * 1000,
      openPrices[i],
      closePrices[i],
      minPrices[i],
      maxPrices[i]
    ];
  });

  let dataSet = new CandleDataSet(dataItems, scene.width, scene.height);
  scene.setData(dataSet);
  // scene.setData(dataItems);
});
// initSocket();

function fetchHistory(params = {
  symbol: 'EURUSD',
  resolution: 'D',
  from: 1497244719,
  to: 1528348779
}) {
  const queryString = Object
    .keys(params)
    .map(key => `${key}=${params[key]}`)
    .join('&');

  const url = `/_liteforex/ru/chart/history?${queryString}`;

  return fetch(url)
    .then(response => response.json())
    .catch(err => console.error(err));
}

function initSocket() {
  const user = {
      id: 1,
      email: "user-demo-tour@liteforex.com",
      full_name: "LiteForex DemoTour",
      username: "DemoTour",
      isReadOnly: false,
      isRealMode: false,
      isUsername: true,
      ratingAttempt: 2,
      ip: "5.128.82.21",
      sessionId: "8qlfdr3me5ir8s0pbgrfrg3go1"
  };

  const socket = io('https://my.liteforex.com:3001');
  let isReady = false;

  socket.on('connect', () => {
    console.log('socket connected');
    // if (isReady) {
      socket.emit('user_init', { session: user.sessionId });
    // }
  });

  socket.on('ready', () => {
    console.log('socket ready');
    isReady = true;
  });

  socket.on('event', (e) => console.log('socket event', e));
  socket.on('disconnect', () => console.log('socket disconnected'));
}

function initialize() {
  let scene = new Scene({
    width: 1000,
    height: 700,
    style: {
      backgroundColor: '#fff',
      zIndex: 1,
      border: '1px solid black'
    }
  });

  scene.appendTo(document.getElementById('app'));
  scene.render();

  animateScene(scene);

  return scene;
}

function animateScene(scene) {
  scene.render();
  window.requestAnimationFrame(animateScene.bind(this, scene));
}
