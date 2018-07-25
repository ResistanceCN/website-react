import throttle from 'lodash/throttle';
import render from './markdown';

const ctx: Worker = self as any;

ctx.addEventListener("message", throttle(e => ctx.postMessage(render(e.data)), 240));
