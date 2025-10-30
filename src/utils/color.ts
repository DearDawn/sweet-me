export type EColor =
  | 'red'
  | 'pink'
  | 'orange'
  | 'yellow'
  | 'lime'
  | 'green'
  | 'teal'
  | 'cyan'
  | 'blue'
  | 'indigo'
  | 'grape'
  | 'purple'
  | 'gray';

export const COLOR_RGB_MAP: Record<EColor, [number, number, number]> = {
  gray: [134, 142, 150],
  red: [250, 82, 82],
  pink: [230, 73, 128],
  grape: [190, 75, 219],
  purple: [121, 80, 242],
  indigo: [76, 110, 245],
  blue: [34, 139, 230],
  cyan: [21, 170, 191],
  teal: [18, 184, 134],
  green: [64, 192, 87],
  lime: [130, 201, 30],
  yellow: [250, 176, 5],
  orange: [253, 126, 20],
};

export const COLOR_NAME: Record<EColor, string> = {
  red: '红色',
  pink: '粉色',
  orange: '橙色',
  yellow: '黄色',
  lime: '青柠色',
  green: '绿色',
  teal: '蓝绿色',
  cyan: '青色',
  blue: '蓝色',
  indigo: '靛青色',
  grape: '葡萄色',
  purple: '紫色',
  gray: '灰色',
};

/**
 * 获取颜色对应的 RGB 值
 * @param colorName 颜色名
 * @returns RGB 值数组
 */
export const getColorRGB = (colorName: EColor) => {
  return COLOR_RGB_MAP[colorName] || []; // 如果颜色名无效，则返回空数组
};

/**
 * RGB 转 HSL
 * @param r 红色值
 * @param g 绿色值
 * @param b 蓝色值
 * @returns HSL 值数组
 */
export const rgbToHsl = (_r: number, _g: number, _b: number) => {
  const [r, g, b] = [_r, _g, _b].map((v) => v / 255);
  const maxValue = Math.max(r, g, b);
  const minValue = Math.min(r, g, b);

  let h, s, l;

  if (maxValue === minValue) {
    h = 0; // 色相
  } else if (maxValue === r) {
    h = ((g - b) / (maxValue - minValue)) % 6;
  } else if (maxValue === g) {
    h = 2 + (b - r) / (maxValue - minValue);
  } else {
    h = 4 + (r - g) / (maxValue - minValue);
  }

  h = Math.round(h * 60); // 转换为度数

  if (h < 0) {
    h += 360; // 保证色相在 0 到 360 范围内
  }

  l = (maxValue + minValue) / 2; // 亮度

  if (maxValue === minValue) {
    s = 0; // 饱和度
  } else if (l <= 0.5) {
    s = (maxValue - minValue) / (maxValue + minValue);
  } else {
    s = (maxValue - minValue) / (2 - maxValue - minValue);
  }

  s = Math.round(s * 100); // 转换为百分比
  l = Math.round(l * 100); // 转换为百分比

  return [h, s, l];
};
