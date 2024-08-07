<template>
  <div class="book-shelf" ref="bookShelfRef">
    <h1 class="title">书架</h1>
    <template v-for="book in bookList">
      <Book :book="book" @click="handleBookClick"/>
    </template>
    <div class="page-control">
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
import { setCurrentReadBook } from '../../store';
import router from '../../router/router.ts';

const bookShelfRef = ref<HTMLDivElement>()
const bookList = ref<BookInfo[]>([])

const handleBookClick = (res: BookInfo) => {
  setCurrentReadBook(res);
  router.push('/book-content')
}
const handleUp = () => {
  if (bookShelfRef.value) {
    bookShelfRef.value.scrollTop -= 120
  }
}
const handleDown = () => {
  if (bookShelfRef.value) {
    bookShelfRef.value.scrollTop += 120
  }
}
onMounted(async () => {
  bookList.value = await getBookshelf();
})
</script>

<style lang="scss" scoped>
.book-shelf {
  height: 100%;
  overflow: auto;

  .title {
    padding: 0 20px;
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