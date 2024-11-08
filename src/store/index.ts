import { BookChapterCache, BookInfo } from '../api/types.ts';
import { getChapterList } from '../api';
import * as localforage from 'localforage';
import { reactive, ref, toRaw } from 'vue';

const isSupportIndexDB = 'indexedDB' in window;

export const state = reactive({
  config: {
    fontSize: 24,
    serverUrl: 'http://192.168.31.205:1122',
    fontFamily: '方正准圆简体',
    alwaysNextPage: false,
  },
  readingBook: {} as BookInfo,
});
try {
  const version = localStorage.getItem('version');
  if (version !== __APP_VERSION) {
    localStorage.clear();
    localStorage.setItem('version', __APP_VERSION);
    localStorage.setItem('state', JSON.stringify(toRaw(state)));
  } else {
    const savedState = JSON.parse(localStorage.getItem('state') as string);
    Object.assign(state, savedState);
  }
} catch {
// ignore
}
export const chapterListCache = ref<BookChapterCache[]>([]);

export function saveConfig() {
  localStorage.setItem('state', JSON.stringify(toRaw(state)));
}

export const setCurrentReadBook = (book: BookInfo) => {
  state.readingBook = book;
  saveConfig();
};
/**
 * 下一章、上一章时，更新当前书籍的章节
 * @param index
 */
export const updateCurrentReadChapter = (index: number) => {
  state.readingBook.durChapterIndex = index;
  saveConfig()
};
/**
 * 查询书籍章节列表
 */
export const queryBookChapters = async () => {
  const bookUrl = state.readingBook.bookUrl;
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
export const syncBookChapters = async () => {
  const bookUrl = state.readingBook.bookUrl;
  const chapterList = await getChapterList(bookUrl);
  const cache = {
    bookUrl,
    chapterList: chapterList.map(i => ({
      index: i.index,
      title: i.title,
    })),
  };
  const index = chapterListCache.value.findIndex(item => item.bookUrl === bookUrl);
  if (index !== -1) {
    chapterListCache.value.splice(index, 1, cache);
  } else {
    chapterListCache.value.push(cache);
  }
  await localforage.setItem('chapter-list', toRaw(chapterListCache.value));
};
export const recoverFromLocalForage = async () => {
  chapterListCache.value = await localforage.getItem('chapter-list') || [];
};