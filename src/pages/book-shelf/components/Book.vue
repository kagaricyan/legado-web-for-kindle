<template>
  <div class="book" @click="handleClick">
    <div class="cover">
      <img :src="coverUrl" alt="cover">
    </div>
    <div class="info">
      <div class="name">
        <span>{{ book.name }}</span>
      </div>
      <div class="sub">
        <span>{{ book.author }}</span>
        <span>•</span>
        <span>共{{ book.totalChapterNum }}章</span>
        <span>•</span>
        <span>{{ formatDate(book.lastCheckTime) }}</span>
      </div>
      <div class="read">
        <span>已读：{{ book.durChapterTitle }}</span>
      </div>
      <div class="latest">
        <span>最新：{{ book.latestChapterTitle }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BookInfo } from '../../../api/types.ts';
import { computed } from 'vue';
import { formatDate, getCover } from '../../../utils';

interface Props {
  book: BookInfo;
}

const props = defineProps<Props>();
const emits = defineEmits<{
  (e: 'click', res: BookInfo): void
}>();
const coverUrl = computed(() => {
  const url = props.book.customCoverUrl || props.book.coverUrl;
  return getCover(url);
});

const handleClick = () => {
  emits('click', props.book);
};
</script>

<style lang="scss" scoped>
.book {
  display: flex;
  overflow: hidden;
  width: 100%;
  height: 130px;
  box-sizing: border-box;
  padding: 10px 20px;

  .cover {
    display: flex;
    justify-content: center;
    overflow: hidden;
    width: 80px;
    height: 112px;
    flex: 0 0 auto;

    img {
      height: 112px;
      width: auto;
    }
  }

  .info {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    flex: 1 1 0;
    overflow: hidden;
    margin-left: 20px;

    .name {
      font-size: 16px;
      font-weight: bold;
      color: #333;
      text-align: justify;
      word-break: break-word;
    }

    .sub {
      display: flex;
      align-items: center;
      overflow: hidden;
      font-size: 12px;
      font-weight: bold;
      color: #666;
    }

    .read {
      display: flex;
      align-items: center;
      font-size: 12px;
      font-weight: bold;
      color: #666;
    }

    .latest {
      display: flex;
      align-items: center;
      font-size: 12px;
      font-weight: bold;
      color: #666;
    }
  }
}
</style>