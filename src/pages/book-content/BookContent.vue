<template>
  <div class="book-content" @click.stop="pageHandler">
    <div class="page" :style="computedPageStyle">
      <!--完整文章区域，通过 translateY 向上移动，实现翻页-->
      <div class="book-content-container"
           ref="bookContentContainer"
           :style="computedContentContainerStyle">
        <p><span>{{ currentChapterName }}</span></p>
        <template v-if="chapterLoading||contentLoading">
          <div class="loading"><span>加载中...</span></div>
        </template>
        <template v-for="s in bookContentStr.split('\n')">
          <p><span>{{ s }}</span></p>
        </template>
      </div>
    </div>
  </div>
  <menu-dialog
      v-model:visible="menuVisible"
      @pre-chapter="queryContent(state.readingBook.durChapterIndex-1)"
      @next-chapter="queryContent(state.readingBook.durChapterIndex+1)"
  />
</template>

<script setup lang="ts">
import { chapterListCache, queryBookChapters, state, updateCurrentReadChapter } from '../../store';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { getBookContent, saveReadProgress } from '../../api';
import MenuDialog from './components/MenuDialog.vue';
import { useDebounceFn, useToggle } from '@vueuse/core';
import router from '../../router/router.ts';
import { createPage, PageInfo } from '../../utils/novel.ts';

const computedPageStyle = computed(() => {
  const config = state.value.config;
  return {
    bottom: `calc(10px + ${currentPageInfo.value.maskHeight}px)`,
    fontSize: `${config.fontSize}px`,
    fontFamily: config.fontFamily,
  };
});

const computedContentContainerStyle = computed(() => {
  return {
    transform: `translateY(-${currentPageInfo.value.scrollY}px)`,
  };
});
// 菜单弹窗
const [menuVisible, toggleMenuVisible] = useToggle();
// 文本区容器，控制翻页
const bookContentContainer = ref<HTMLDivElement>();
// 章节内容
const bookContentStr = ref('');
// 页面高度
const pageBottomY = window.innerHeight - 11;
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
const pages = ref<PageInfo[]>([]);
const currentPageInfo = computed(() => {
  return pages.value[currentPage.value - 1] || {};
});
const handlePage = async (e: MouseEvent) => {
  if (chapterLoading.value) return;
  // 点击位置小于1/3，上翻页
  if (e.clientX < window.innerWidth / 3) {
    if (bookContentContainer.value) {
      if (currentPage.value !== 1) {
        currentPage.value--;
      } else {
        await queryContent(state.value.readingBook.durChapterIndex - 1);
      }
    }
  }
  // 点击位置大于2/3，下翻页
  else if (e.clientX > window.innerWidth * 2 / 3) {
    if (bookContentContainer.value) {
      if (currentPage.value !== pages.value.length) {
        currentPage.value++;
      } else {
        await queryContent(state.value.readingBook.durChapterIndex + 1);
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
const queryContent = async (index: number) => {
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
    bookContentStr.value = await getBookContent(bookUrl, index);
  } finally {
    toggleContentLoading(false);
  }
};
watch(() => {
  const config = state.value.config;
  return [bookContentStr.value, currentChapterName.value, config.fontSize, config.fontFamily];
}, async () => {
  currentPage.value = 1;
  await nextTick();
  if (currentChapterName.value) {
    requestAnimationFrame(() => {
      if (bookContentContainer.value) {
        pages.value = createPage(bookContentContainer.value, pageBottomY);
      }
    });
  }
});

onMounted(async () => {
  const bookUrl = state.value.readingBook.bookUrl;
  if (!bookUrl) {
    await router.push('/');
    return;
  }
  await queryChapterList();
  await queryContent(state.value.readingBook.durChapterIndex);
});
</script>

<style scoped lang="scss">
.book-content {
  overflow: hidden;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 10px 20px;

  .page {
    position: fixed;
    top: 10px;
    right: 20px;
    bottom: 10px;
    left: 20px;
    overflow: hidden;
    box-sizing: border-box;
    background-color: #fff;

    .book-content-container {
      overflow: hidden;

      .loading {
        font-size: 24px;
        font-weight: bold;
      }

      p {
        text-align: justify;
        line-height: 1.2;
      }
    }

  }
}
</style>