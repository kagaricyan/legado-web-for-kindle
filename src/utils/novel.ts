interface MeasureTextFun {
  (text: string, isFirst?: boolean): number;
}

/**
 * 创建测试文特定字体下本长度的方法
 * @param fontSize
 * @param fontFamily
 */
function createTextMeasure(fontSize: number, fontFamily: string): MeasureTextFun {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw Error('not support');
  }
  ctx.font = `${fontSize}px ${fontFamily}`;

  return (text: string, isFirst = false) => {
    if (isFirst) {
      return ctx.measureText(text).width + ctx.measureText(text.substring(0, 2)).width;
    }
    return ctx.measureText(text).width;
  };
}

/**
 * 测试一行最多可以放几个字符
 * @param text
 * @param lineWidth
 * @param measureFun
 */
function testLineWordsCount(text: string, lineWidth: number, measureFun: MeasureTextFun) {
  const testText = text.length > 300 ? text : text.repeat(Math.ceil(300 / (text.length || 1)));
  let i = 1;
  while (measureFun(testText.substring(0, i)) <= lineWidth) {
    i++;
  }
  return i;
}

/**
 * 将一个段落的文本拆分成多行，一行一个数组
 * @param text
 * @param fontSize
 * @param fontFamily
 * @param lineWidth
 */
function splitParagraphLines(text: string, fontSize: number, fontFamily: string, lineWidth: number) {
  const textWidth = createTextMeasure(fontSize, fontFamily);
  const idealLineWordsCount = testLineWordsCount(text, lineWidth, textWidth);
  let restText = text.trim();
  const resultLines: string[] = [];
  while (restText.length > 0) {
    const isFirst = resultLines.length === 0;
    const idealMeasureWidth = textWidth(restText.substring(0, idealLineWordsCount), isFirst);
    let realWordsCount = idealLineWordsCount;
    if (idealMeasureWidth < lineWidth && restText.substring(idealLineWordsCount).length > 0) {
      realWordsCount += 1;
      while (textWidth(restText.substring(0, realWordsCount), isFirst) < lineWidth) {
        realWordsCount++;
      }
    } else if (idealMeasureWidth > lineWidth) {
      realWordsCount -= 1;
      while (textWidth(restText.substring(0, realWordsCount), isFirst) > lineWidth) {
        realWordsCount--;
      }
    }
    if (textWidth(restText.substring(0, realWordsCount), isFirst) > lineWidth) {
      realWordsCount -= 1;
    }
    resultLines.push(restText.substring(0, realWordsCount));
    restText = restText.substring(realWordsCount);
  }
  return resultLines;
}

export interface ParserNovelOption {
  // 本章内容
  text: string;
  // 字体大小
  fontSize: number;
  // 字体名称
  fontFamily: string;
  // 行宽
  lineWidth: number;
  // 行高
  lineHeight: number;
  // 段落间间距
  paragraphMargin: number;
  // 页面高度
  pageHeight: number;
}

export interface PageLine {
  tag: 'start' | 'center' | 'end';
  text: string;
}

function computedHeight(pageLines: PageLine[], fontSize: number, lineHeight: number, paragraphMargin: number) {
  return pageLines.reduce((acc, cur)=>{
    acc+=fontSize*lineHeight;
    if (cur.tag==='start') {
      acc+=paragraphMargin
    }
    return acc;
  }, 0)
}

/**
 *
 * @param option
 * eg: [
 * // 第一页
 *   [
 *     {tag: 'first', text: 'xxx'},
 *     {tag: 'center', text: 'xxx'},
 *     {tag: 'end', text: 'xxx'},
 *     {tag: 'first', text: 'xxx'},
 *   ]
 * ]
 */
export function parserNovel(option: ParserNovelOption) {
  const pageArr: PageLine[][] = [[]];
  const paragraphs = option.text.split('\n').map(str => splitParagraphLines(str, option.fontSize, option.fontFamily, option.lineWidth));
  for (let i = 0; i < paragraphs.length; i++) {
    for (let j = 0; j < paragraphs[i].length; j++) {
      const currentPage = pageArr[pageArr.length - 1];
      const currentLine: PageLine = {
        text: paragraphs[i][j],
        tag: j === 0 ? 'start' : j === paragraphs[i].length - 1 ? 'end' : 'center',
      };
      const heightWill = computedHeight([...currentPage, currentLine], option.fontSize, option.lineHeight, option.paragraphMargin);
      if (heightWill > option.pageHeight) {
        pageArr.push([currentLine]);
      } else {
        currentPage.push(currentLine);
      }
    }
  }
  return pageArr
}