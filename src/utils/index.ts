import { state } from '../store';

export function padNum(s: number) {
  return `0${s}`.slice(-2);
}

export function formatDate(s: string | number) {
  const date = new Date(s);
  return `${date.getFullYear()}-${padNum(date.getMonth() + 1)}-${padNum(date.getDate())}`;
}

export function getCover(path: string) {
  return `${state.config.serverUrl}/cover?path=${path}`;
}