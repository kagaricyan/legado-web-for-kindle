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
          <span :style="fontStyle">字体大小：</span>
          <span>{{ state.config.fontSize }}</span>
        </div>
        <div class="control">
          <button class="custom-button" @click="state.config.fontSize--">减小</button>
          <button class="custom-button" @click="state.config.fontSize++">增大</button>
        </div>
      </div>
      <div class="menu-item font-size">
        <div class="name">
          <span :style="fontStyle">字体设置：</span>
        </div>
        <div class="control">
          <select class="custom-select" v-model="state.config.fontFamily">
            <option value="思源黑体">思源黑体</option>
            <option value="方正准圆简体">方正准圆简体</option>
            <option value="方正楷体">方正楷体</option>
          </select>
        </div>
      </div>
      <div class="menu-item font-size">
        <div class="name">
          <span>翻页控制：</span>
        </div>
        <div class="control">
          <label for="always-next-page">始终下一页(点左边/右边都是下一页)</label>
          <input class="custom-checkbox"
                 id="always-next-page"
                 type="checkbox"
                 v-model="state.config.alwaysNextPage">
        </div>
      </div>
      <div class="hint">
        <b>注意事项：</b>
        <ul>
          <li>修改字体大小：更改字体大小会回到本章首页，重新分页</li>
          <li>修改字体：如过刚打开浏览器没多久，需要等一段时间字体才能加载完，才能生效</li>
          <li>
            由于计算精度问题，页面上下可能部分露出一点点文字。特别是切换字体后，如果露出的比较多，切换一下上一章/下一章，会使用当前字体重新排版
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { state } from '../../../store';
import router from '../../../router/router.ts';
import { computed, ref } from 'vue';

interface Props {
  visible: boolean;
}

const v = ref(false);
const props = defineProps<Props>();
const emits = defineEmits<{
  (e: 'update:visible', res: boolean): void
  (e: 'pre-chapter'): void
  (e: 'next-chapter'): void
}>();

const fontStyle = computed(() => {
  return {
    fontFamily: state.config.fontFamily,
    fontSize: `${state.config.fontSize}px`,
  };
});
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