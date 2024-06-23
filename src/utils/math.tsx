/**
 * @description 获取一个值在 min 和 max 之间的值
 * @param min 最小值
 * @param value 值
 * @param max 最大值
 * @returns
 */
export const clamp = (min: number, value: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};