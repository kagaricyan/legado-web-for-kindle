interface LineInfo {
  y: number;
  height: number;
}

export interface PageInfo {
  scrollY: number;
  maskHeight: number;
}

/**
 * 解析如何分页
 * @param container 文章区父容器
 * @param pageBottomY 正文区域底部对应屏幕的y值
 */
export function createPage(container: HTMLElement, pageBottomY: number) {
  const elements = container.querySelectorAll('p>span');
  const lineInfos: LineInfo[] = [];
  elements.forEach(e => {
    const rects = e.getClientRects();
    for (let i = 0; i < rects.length; i++) {
      const rect = rects[i];
      lineInfos.push({ y: Math.floor(rect.top - 1), height: Math.ceil(rect.height) });
    }
  });

  const pageInfos: PageInfo[] = [{ scrollY: 0, maskHeight: 0 }];
  lineInfos.forEach((line) => {
    // 上一页
    const lastPage = pageInfos[pageInfos.length - 1];
    if (line.y - lastPage.scrollY > pageBottomY) {
      pageInfos.push({ scrollY: line.y - 10, maskHeight: 0 });
    } else if (line.y - lastPage.scrollY + line.height > pageBottomY) {
      pageInfos.push({ scrollY: line.y - 10, maskHeight: 0 });
      lastPage.maskHeight = line.height - (line.y - lastPage.scrollY + line.height - pageBottomY);
    }
  });
  return pageInfos;
}