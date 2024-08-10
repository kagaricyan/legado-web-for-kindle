<template>
  <div class="menu-dialog" :class="{visible}">
    <div class="shadow" @click="handleClose"></div>
    <div class="menu">
      <div class="menu-item buttons">
        <button class="custom-button" @click="emits('pre-chapter')">上一章</button>
        <button class="custom-button" @click="emits('next-chapter')">下一章</button>
        <button class="custom-button" @click="handleBack">返回书架</button>
      </div>
      <div class="menu-item font-size">
        <div class="name">
          <span :style="{fontSize: `${state.config.fontSize}px`}">字体大小：</span>
          <span>{{ state.config.fontSize }}</span>
        </div>
        <div class="control">
          <button class="custom-button" @click="state.config.fontSize--">减小</button>
          <button class="custom-button" @click="state.config.fontSize++">增大</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { state } from '../../../store';
import router from '../../../router/router.ts';

interface Props {
  visible: boolean;
}

const props = defineProps<Props>();
const emits = defineEmits<{
  (e: 'update:visible', res: boolean): void
  (e: 'pre-chapter'): void
  (e: 'next-chapter'): void
}>();


const handleClose = () => {
  emits('update:visible', false);
};
const handleBack = () => {
  router.push('/');
  handleClose();
};
</script>

<style scoped lang="scss">
.menu-dialog {
  font-family: sans-serif;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1;
  display: none;
  justify-content: center;
  overflow: hidden;
  background-color: transparent;

  &.visible {
    display: flex;
  }

  .shadow {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 1;
    background-color: transparent;
  }

  .menu {
    position: absolute;
    z-index: 2;
    top: 40px;
    overflow: hidden;
    width: 80%;
    height: 70%;
    background-color: #fff;
    box-sizing: border-box;
    padding: 20px;
    border-radius: 8px;
    border: solid 2px #666;

    .menu-item {
      margin-bottom: 10px;

      &.buttons {
        display: flex;
        justify-content: space-between;
      }

      &.font-size {
        display: flex;
        justify-content: space-between;
        align-items: center;
        overflow: hidden;

        .name {
          font-size: 16px;
          color: #333;
          font-weight: bold;
        }

        .control {
          display: flex;
          align-items: center;

          span {
            font-size: 16px;
          }

        }
      }

    }
  }
}
</style>