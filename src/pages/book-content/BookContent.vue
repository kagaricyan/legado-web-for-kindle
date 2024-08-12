<template>
  <div class="book-content" @click.stop="pageHandler">
    <div class="read-box"
         :style="{fontSize: `${state.config.fontSize}px`, fontFamily: state.config.fontFamily }">
      <template v-for="e in currentPageElements">
        <p class="real-render" :class="e.className">{{ e.innerText }}</p>
      </template>
      <template v-if="chapterLoading||contentLoading">
        <div class="loading">加载中...</div>
      </template>
    </div>
    <div class="con"
         ref="bookContentRef"
         :style="{fontSize: `${state.config.fontSize}px`, fontFamily: state.config.fontFamily}">
      <p>{{ currentChapterName }}</p>
      <template v-for="s in bookContentStr.split('\n')">
        <p class="pre-render" :class="{
          'part-paragraph-start': s.includes('partParagraphStart'),
          'part-paragraph-center': s.includes('partParagraphCenter'),
          'part-paragraph-end': s.includes('partParagraphEnd'),
          }">
          {{ s.replace(/(partParagraphStart|partParagraphCenter|partParagraphEnd)/, '') }}</p>
      </template>
    </div>
  </div>
  <menu-dialog
      v-model:visible="menuVisible"
      @pre-chapter="queryChapterContent(state.readingBook.durChapterIndex-1)"
      @next-chapter="queryChapterContent(state.readingBook.durChapterIndex+1)"
  />
</template>

<script setup lang="ts">
import {
  chapterListCache,
  queryBookChapters,
  state,
  updateCurrentReadChapter,
} from '../../store';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { getBookContent, saveReadProgress } from '../../api';
import MenuDialog from './components/MenuDialog.vue';
import { useDebounceFn, useToggle } from '@vueuse/core';
import router from '../../router/router.ts';
import { collectPages, preHandleContent } from '../../utils';

// 菜单弹窗
const [menuVisible, toggleMenuVisible] = useToggle();
// 文本区容器，控制翻页
const bookContentRef = ref<HTMLDivElement>();
// 章节内容
const bookContentStr = ref('');
// 页面高度
const pageHeight = Math.floor(window.innerHeight / 100 * 90);

const [chapterLoading, toggleChapterLoading] = useToggle();
const [contentLoading, toggleContentLoading] = useToggle();
const pageHandler = useDebounceFn((e: MouseEvent) => handlePage(e), 300);

const currentChapterList = computed(() => {
  const bookUrl = state.value.readingBook.bookUrl;
  return chapterListCache.value.find(i => i.bookUrl === bookUrl)?.chapterList;
});
const currentChapterName = computed(() => {
  const index = state.value.readingBook.durChapterIndex;
  return currentChapterList.value?.find(i => i.index === index)?.title || '';
});

/**
 * 翻页
 * 以150px为界限，点击左边向前翻页，点击右边向右翻页，点击中间弹出菜单
 * @param e 点击事件
 */
const currentPage = ref(1);
const pages = ref<HTMLElement[][]>([]);
const currentPageElements = computed(() => {
  return pages.value[currentPage.value - 1] || [];
});
const handlePage = async (e: MouseEvent) => {
  if (chapterLoading.value) return;

  if (e.clientX < 150) {
    if (bookContentRef.value) {
      if (currentPage.value !== 1) {
        currentPage.value--;
      } else {
        await queryChapterContent(state.value.readingBook.durChapterIndex - 1);
      }
    }
  } else if (e.clientX > window.innerWidth - 150) {
    if (bookContentRef.value) {
      if (currentPage.value !== pages.value.length) {
        currentPage.value++;
      } else {
        await queryChapterContent(state.value.readingBook.durChapterIndex + 1);
      }
    }
  } else {
    toggleMenuVisible(true);
  }
};
const queryChapterList = async () => {
  try {
    toggleChapterLoading(true);
    await queryBookChapters();
  } finally {
    toggleChapterLoading(false);
  }
};
/**
 * 查询章节内容
 * @param index
 */
const queryChapterContent = async (index: number) => {
  if (contentLoading.value) {
    return;
  }
  const readingBook = state.value.readingBook;
  const bookUrl = readingBook.bookUrl;
  bookContentStr.value = '';
  currentPage.value = 1;
  pages.value = [];
  updateCurrentReadChapter(index);
  try {
    toggleContentLoading(true);
    await saveReadProgress({
      name: readingBook.name,
      author: readingBook.author,
      durChapterIndex: index,
      durChapterPos: 0,
      durChapterTime: Date.now(),
      durChapterTitle: currentChapterName.value,
    });
    const data = await getBookContent(bookUrl, index);
    bookContentStr.value = preHandleContent(data);
  } finally {
    toggleContentLoading(false);
  }
};

watch(() => {
  const config = state.value.config;
  return [bookContentStr.value, currentChapterName.value, config.fontSize, config.fontFamily];
}, async () => {
  await nextTick();
  requestAnimationFrame(() => {
    if (bookContentRef.value) {
      pages.value = collectPages(pageHeight, bookContentRef.value.querySelectorAll('.con > p'));
    }
  });
});

onMounted(async () => {
  const bookUrl = state.value.readingBook.bookUrl;
  if (!bookUrl) {
    await router.push('/');
    return;
  }
  await queryChapterList();
  await queryChapterContent(state.value.readingBook.durChapterIndex);
});
</script>

<style scoped lang="scss">
.book-content {
  overflow: hidden;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 10px 20px;

  .con, .read-box {
    overflow: auto;
    width: 100%;
    height: 100%;

    .loading {
      font-size: 24px;
      font-weight: bold;
    }

    p {
      line-height: 1.2;
      margin: 5vh 0;
      text-align: justify;

      &.pre-render:not(.real-render) {
        opacity: 0;
      }

      &.part-paragraph-start {
        margin-bottom: 0;
      }

      &.part-paragraph-center {
        margin: 0;
      }

      &.part-paragraph-end {
        margin-top: 0;
      }
    }
  }
}
</style>