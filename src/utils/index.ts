import { ServerUrl } from '../store';

export function createNodeByTemplate(s: string) {
  const node = document.createElement('div');
  node.innerHTML = s;
  return node.firstElementChild!;
}

export function padNum(s: number) {
  return `0${s}`.slice(-2)
}

export function formatDate(s: string | number) {
  const date = new Date(s);
  return `${date.getFullYear()}-${padNum(date.getMonth())}-${padNum(date.getDate())}`
}

export function getCover(path: string) {
  return `${ServerUrl}/cover?path=${path}`
}
