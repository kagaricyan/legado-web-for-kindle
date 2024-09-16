import axios from 'axios';
import { BookChapter, BookInfo, Config, ReadProgress, Response } from './types.ts';
import { state } from '../store';

function getBaseUrl() {
  const url = state.config.serverUrl;
  if (url[url.length - 1] === '/') {
    return url.slice(0, url.length - 1);
  }
  return url;
}

/**
 * 用户配置
 */
export async function getConfig() {
  const url = '/getReadConfig';
  const data = await axios.get<Response<string>>(url, {
    baseURL: getBaseUrl(),
  });
  return JSON.parse(data.data.data) as Config;
}

/**
 * 书架
 */
export async function getBookshelf() {
  const url = '/getBookshelf';
  const data = await axios.get<Response<BookInfo[]>>(url, {
    baseURL: getBaseUrl(),
  });
  return data.data.data;
}

/**
 * 章节列表
 * @param bookUrl
 */
export async function getChapterList(bookUrl: string) {
  const url = '/getChapterList';
  const data = await axios.get<Response<BookChapter[]>>(url, { params: { url: bookUrl }, baseURL: getBaseUrl() });
  return data.data.data;
}

/**
 * 章节正文
 * @param bookUrl 书源地址
 * @param index 第几章
 */
export async function getBookContent(bookUrl: string, index: number) {
  const url = '/getBookContent';
  const data = await axios.get<Response<string>>(url, { params: { url: bookUrl, index }, baseURL: getBaseUrl() });
  return data.data.data;
}


export function saveReadProgress(params: ReadProgress) {
  const url = '/saveBookProgress';
  return axios.post(url, params, { baseURL: getBaseUrl() });
}