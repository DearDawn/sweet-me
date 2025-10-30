/** 获取元素最近的可滚动父元素 */
export const findClosestScrollableParent = (element: HTMLElement) => {
  let parent = element.parentElement;

  while (parent) {
    if (
      parent.scrollHeight > parent.clientHeight ||
      parent.scrollWidth > parent.clientWidth
    ) {
      return parent;
    }
    parent = parent.parentElement;
  }

  return null;
};
