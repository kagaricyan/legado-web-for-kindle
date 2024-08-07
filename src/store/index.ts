import { BookChapter, BookInfo } from '../api/types.ts';
import { getChapterList } from '../api';
import { useStorage } from '@vueuse/core';

export const ServerUrl = 'http://192.168.31.205:1122';
export const currentReadBook = useStorage<BookInfo>('current-read-book', {} as BookInfo)
export const bookChapterList = useStorage<BookChapter[]>('book-chapter-list', []);
export const config = useStorage('config', { fontSize: 20 })
export const setCurrentReadBook = (book: BookInfo) => {
  currentReadBook.value = book;
}
/**
 * 下一章、上一章时，更新当前书籍的章节
 * @param index
 */
export const updateCurrentReadChapter = (index: number) => {
  currentReadBook.value.durChapterIndex = index;
}
/**
 * 查询书籍章节列表
 */
export const queryBookChapters = async () => {
  if (bookChapterList.value.length === 0) {
    const url = currentReadBook.value!.bookUrl;
    bookChapterList.value = await getChapterList(url)
  }
}

export const clearBookChapters = () => {
  bookChapterList.value = [];
}