import { state } from '../store';

export function padNum(s: number) {
  return `0${s}`.slice(-2);
}

export function formatDate(s: string | number) {
  const date = new Date(s);
  return `${date.getFullYear()}-${padNum(date.getMonth())}-${padNum(date.getDate())}`;
}

export function getCover(path: string) {
  return `${state.value.config.serverUrl}/cover?path=${path}`;
}

/**
 * 段落处理，如果有某段超过120个字符，分成多段
 * @param s
 */
export const preHandleContent = (s: string) => {
  const sArr = s.split('\n');
  const resultArr: string[] = [];
  sArr.forEach(s1 => {
    if (s1.length <= 120) {
      resultArr.push(s1);
    } else {
      const groupNum = Math.ceil(s1.length / 120);
      for (let i = 0; i < groupNum; i++) {
        if (i === 0) {
          resultArr.push(`partParagraphStart${s1.substring(i * 120, (i + 1) * 120)}`);
        } else if (i === groupNum - 1) {
          resultArr.push(`partParagraphEnd${s1.substring(i * 120, (i + 1) * 120)}`);
        } else {
          resultArr.push(`partParagraphCenter${s1.substring(i * 120, (i + 1) * 120)}`);
        }
      }
    }
  });
  return resultArr.join('\n');
};

/**
 * 手动分页，
 * 根据渲染的dom，遍历所有元素，计算高度，每页放一部分元素，其总高度不超过页的高度
 * @param pageHeight 页面高度
 * @param elementList 文章元素列表
 */
export function collectPages(pageHeight: number, elementList: NodeListOf<HTMLElement>) {
  const sizeNumber = (s: string) => {
    return Number(s.replace('px', ''));
  };
  const computeElementHeight = (element: HTMLElement, beforeElement?: HTMLElement) => {
    const elementHeight = element.getBoundingClientRect().height;
    const elementStyle = window.getComputedStyle(element);
    const elementMarginTop = sizeNumber(elementStyle.marginTop);
    const elementMarginBottom = sizeNumber(elementStyle.marginBottom);
    let computeMarginTop = sizeNumber(elementStyle.marginTop);
    if (beforeElement) {
      const beforeElementStyle = window.getComputedStyle(beforeElement);
      const beforeMarginBottom = sizeNumber(beforeElementStyle.marginBottom);
      if (elementMarginTop <= beforeMarginBottom) {
        computeMarginTop = 0;
      } else {
        computeMarginTop = elementMarginTop - beforeMarginBottom;
      }
    }
    return {
      elementHeight: elementHeight + computeMarginTop + elementMarginBottom,
      elementMarginBottom: elementMarginBottom,
    };
  };
  const pages: HTMLElement[][] = [[]];
  let currentElementsHeight = 0;
  for (let i = 0; i < elementList.length; i++) {
    const element = elementList[i];
    const currentPageElements = pages[pages.length - 1];
    const preElement = currentPageElements[currentPageElements.length - 1];
    const computedElementHeight = computeElementHeight(element, preElement);
    currentElementsHeight += computedElementHeight.elementHeight;
    if (currentElementsHeight <= pageHeight) {
      currentPageElements.push(element);
    } else if (currentElementsHeight - computedElementHeight.elementMarginBottom + 5 <= pageHeight) {
      currentPageElements.push(element);
    } else {
      currentElementsHeight = computedElementHeight.elementHeight;
      pages.push([element]);
    }
  }
  return pages;
}