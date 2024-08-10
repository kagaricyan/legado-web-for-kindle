export interface Response<T = any> {
  data: T;
}

export interface Config {
  theme: number;
  font: number;
  fontSize: number;
  readWidth: number;
  infiniteLoading: boolean;
  customFontName: string;
}

export interface BookInfo {
  author: string
  bookUrl: string
  canUpdate: true,
  coverUrl: string
  customCoverUrl: string
  durChapterIndex: number
  durChapterPos: number
  durChapterTime: number
  durChapterTitle: string
  group: number
  intro: string
  kind: string
  lastCheckCount: number
  lastCheckTime: number
  latestChapterTime: number
  latestChapterTitle: string
  name: string
  order: number
  origin: string
  originName: string
  originOrder: number
  readConfig: {
    delTag: number
    imageStyle: string
    reSegment: boolean
    reverseToc: boolean,
    splitLongChapter: boolean
  },
  tocUrl: string
  totalChapterNum: string
  type: number,
  wordCount: string
}

export interface BookChapter {
  baseUrl: string;
  bookUrl: string;
  index: number;
  isPay: boolean;
  isVip: boolean;
  isVolume: boolean;
  tag: string;
  title: string;
  url: string;
}

export interface BookChapterCache {
  bookUrl: string;
  chapterList: { index: number; title: string }[];
}