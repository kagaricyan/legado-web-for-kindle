<template>
  <div class="book-content" @click.stop="handlePage">
    <div class="con" ref="bookContentRef" :style="{fontSize: `${config.fontSize}px`}">
      <template v-if="chapterLoading">
        <div class="loading">加载中...</div>
      </template>
      <template v-else>
        <p>{{ currentChapterName }}</p>
      </template>
      <template v-for="s in bookContentStr.split('\n')">
        <p>{{ s }}</p>
      </template>
    </div>
  </div>
  <menu-dialog v-model:visible="menuVisible"/>
</template>

<script setup lang="ts">
import {
  config,
  currentReadBook,
  bookChapterList,
  queryBookChapters,
  updateCurrentReadChapter,
  clearBookChapters,
} from '../../store';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { getBookContent } from '../../api';
import MenuDialog from './components/MenuDialog.vue';
import { useToggle } from '@vueuse/core';
import router from '../../router/router.ts';

// 菜单弹窗
const [menuVisible, toggleMenuVisible] = useToggle()
// 文本区容器，控制翻页
const bookContentRef = ref<HTMLDivElement>()
// 章节内容
const bookContentStr = ref('');
// 页面高度
const pageHeight = window.innerHeight / 100 * 90;
// 当前滚动位置，下次滚动后，如果位置一致，则切换到上一章/下一章
let currentScrollTop = 0;

const [chapterLoading, toggleChapterLoading] = useToggle();

const currentChapterName = computed(() => {
  const index = currentReadBook.value.durChapterIndex;
  return bookChapterList.value.find(i => i.index === index)?.title || ''
})
/**
 * 翻页
 * 以150px为界限，点击左边向前翻页，点击右边向右翻页，点击中间弹出菜单
 * @param e 点击事件
 */
const handlePage = async (e: MouseEvent) => {
  if (e.clientX < 150) {
    if (bookContentRef.value) {
      bookContentRef.value.scrollTop = bookContentRef.value.scrollTop - pageHeight;
      if (bookContentRef.value.scrollTop !== currentScrollTop) {
        currentScrollTop = bookContentRef.value.scrollTop
      } else {
        await gotoChapter(currentReadBook.value.durChapterIndex - 1)
      }
    }
  } else if (e.clientX > window.innerWidth - 150) {
    if (bookContentRef.value) {
      bookContentRef.value.scrollTop = bookContentRef.value.scrollTop + pageHeight
      if (bookContentRef.value.scrollTop !== currentScrollTop) {
        currentScrollTop = bookContentRef.value.scrollTop
      } else {
        await gotoChapter(currentReadBook.value.durChapterIndex + 1)
      }
    }
  } else {
    toggleMenuVisible(true)
  }
}
const gotoChapter = async (index: number) => {
  const bookUrl = currentReadBook.value!.bookUrl;
  if (!bookUrl) {
    await router.push('/')
    return;
  }
  if (chapterLoading.value) {
    return;
  }
  bookContentStr.value = ''
  currentScrollTop = 0;
  updateCurrentReadChapter(index);
  try {
    toggleChapterLoading(true)
    bookContentStr.value = await getBookContent(bookUrl, index);
  } catch {
    bookContentStr.value = ''
  } finally {
    toggleChapterLoading(false)
  }
}
onMounted(async () => {
  await queryBookChapters();
  await gotoChapter(currentReadBook.value.durChapterIndex);
})
onBeforeUnmount(() => {
  clearBookChapters();
})
</script>

<style scoped lang="scss">
.book-content {
  overflow: hidden;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 5vh 20px;

  .con {
    overflow: auto;
    width: 100%;
    height: 100%;

    .loading {
      color: #333;
      font-size: 24px;
      font-weight: bold;
    }

    p {
      color: #333;
      line-height: 5vh;
      margin: 5vh 0;
    }
  }
}
</style>