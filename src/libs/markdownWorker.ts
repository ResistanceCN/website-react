import throttle from 'lodash/throttle';
import render from './markdown';

const ctx = self as unknown as Worker;

ctx.addEventListener('message', throttle(e => ctx.postMessage(render(e.data)), 240));
