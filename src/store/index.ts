import { BookChapterCache, BookInfo } from '../api/types.ts';
import { getChapterList } from '../api';
import { useStorage } from '@vueuse/core';
import * as localforage from 'localforage';
import { ref, toRaw } from 'vue';

const version = localStorage.getItem('version');

if (!version || version !== __APP_VERSION) {
  localStorage.clear();
  localStorage.setItem('version', __APP_VERSION);
}

const isSupportIndexDB = 'indexedDB' in window;
export const state = useStorage('state', {
  config: {
    fontSize: 24,
    serverUrl: 'http://192.168.31.205:1122',
    fontFamily: '',
  },
  readingBook: {} as BookInfo,
});
export const chapterListCache = ref<BookChapterCache[]>([]);

export const setCurrentReadBook = (book: BookInfo) => {
  state.value.readingBook = book;
};
/**
 * 下一章、上一章时，更新当前书籍的章节
 * @param index
 */
export const updateCurrentReadChapter = (index: number) => {
  state.value.readingBook.durChapterIndex = index;
};
/**
 * 查询书籍章节列表
 */
export const queryBookChapters = async () => {
  const bookUrl = state.value.readingBook.bookUrl;
  if (chapterListCache.value.some(i => i.bookUrl === bookUrl)) {
    return;
  }

  const chapterList = await getChapterList(bookUrl);
  const cache = {
    bookUrl,
    chapterList: chapterList.map(i => ({
      index: i.index,
      title: i.title,
    })),
  };
  // 支持indexDB，缓存全部章节，否则只缓存最近一部的章节
  if (isSupportIndexDB) {
    chapterListCache.value.push(cache);
  } else {
    chapterListCache.value = [cache];
  }
  await localforage.setItem('chapter-list', toRaw(chapterListCache.value));
};

export const recoverFromLocalForage = async () => {
  chapterListCache.value = await localforage.getItem('chapter-list') || [];
};