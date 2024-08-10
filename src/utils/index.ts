import { ServerUrl } from '../store';

export function padNum(s: number) {
  return `0${s}`.slice(-2)
}

export function formatDate(s: string | number) {
  const date = new Date(s);
  return `${date.getFullYear()}-${padNum(date.getMonth())}-${padNum(date.getDate())}`
}

export function getCover(path: string) {
  return `${ServerUrl}/cover?path=${path}`
}

export function collectPages(pageHeight: number, elementList: NodeListOf<HTMLElement>) {
  const sizeNumber = (s: string) => {
    return Number(s.replace('px', ''))
  }
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
        computeMarginTop = 0
      } else {
        computeMarginTop = elementMarginTop - beforeMarginBottom
      }
    }
    return {
      elementHeight: elementHeight + computeMarginTop + elementMarginBottom,
      elementMarginBottom: elementMarginBottom,
    }
  }
  const pages: HTMLElement[][] = [[]];
  let currentElementsHeight = 0;
  for (let i = 0; i < elementList.length; i++) {
    const element = elementList[i];
    const currentPageElements = pages[pages.length - 1];
    const preElement = currentPageElements[currentPageElements.length - 1];
    const computedElementHeight = computeElementHeight(element, preElement);
    currentElementsHeight += computedElementHeight.elementHeight
    if (currentElementsHeight <= pageHeight) {
      currentPageElements.push(element)
    } else if (currentElementsHeight - computedElementHeight.elementMarginBottom + 5 <= pageHeight) {
      currentPageElements.push(element)
    } else {
      currentElementsHeight = computedElementHeight.elementHeight;
      pages.push([element])
    }
  }
  return pages;
}