<template>
  <div class="book-shelf" ref="bookShelfRef">
    <div class="top">
      <h1 class="title">书架</h1>
      <label for="server-url">
        阅读地址
        <input id="server-url" type="text" placeholder="请输入阅读地址" v-model="state.config.serverUrl">
        <button class="custom-button" @click="queryBookShelf">获取书架</button>
      </label>
      <div class="hint">
        <span>请输入阅读APP "Web 服务" 提示的完整地址</span>
      </div>
    </div>
    <p v-if="bookShelfLoading">加载中...</p>
    <template v-for="book in bookList">
      <Book :book="book" @click="handleBookClick"/>
    </template>
    <div class="page-control">
      <button class="custom-button" @click="handleTop">回到顶部</button>
      <button class="custom-button" @click="handleUp">向上</button>
      <button class="custom-button" @click="handleDown">向下</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { BookInfo } from '../../api/types.ts';
import { getBookshelf } from '../../api';
import Book from './components/Book.vue';
import { saveConfig, setCurrentReadBook, state } from '../../store';
import router from '../../router/router.ts';
import { getCover } from '../../utils';
import { useToggle } from '@vueuse/core';

const bookShelfRef = ref<HTMLDivElement>();
const bookList = ref<BookInfo[]>([]);

const handleBookClick = (res: BookInfo) => {
  setCurrentReadBook(res);
  router.push('/book-content');
};
const handleTop = () => {
  if (bookShelfRef.value) {
    bookShelfRef.value.scrollTop = 0;
  }
};
const handleUp = () => {
  if (bookShelfRef.value) {
    bookShelfRef.value.scrollTop -= 120;
  }
};
const handleDown = () => {
  if (bookShelfRef.value) {
    bookShelfRef.value.scrollTop += 120;
  }
};
const [bookShelfLoading, toggleBookShelfLoading] = useToggle();
const queryBookShelf = async () => {
  try {
    saveConfig();
    toggleBookShelfLoading(true);
    bookList.value = [];
    const data = await getBookshelf();
    bookList.value = data.map(i => ({
      ...i,
      coverUrl: getCover(i.coverUrl),
    }));
  } finally {
    toggleBookShelfLoading(false);
  }
};
onMounted(async () => {
  await queryBookShelf();
});
</script>

<style lang="scss" scoped>
.book-shelf {
  height: 100%;
  overflow: auto;

  .top {
    padding: 0 20px;

    label {
      font-size: 20px;
      color: #333;

      input {
        width: 275px;
        height: 44px;
        padding: 10px;
        vertical-align: middle;
        box-sizing: border-box;
        border: solid 2px #333;
        border-radius: 4px;
        font-size: 20px;
      }
    }

    .hint {
      margin-top: 5px;
      font-size: 14px;
      color: #666;
    }
  }


  .page-control {
    position: fixed;
    right: 20px;
    bottom: 20px;
    display: flex;
    flex-direction: column;

    .custom-button {
      margin-bottom: 10px;
    }
  }
}
</style>