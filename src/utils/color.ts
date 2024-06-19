const COLOR_RGB_MAP = {
  red: [250, 82, 82],
  orange: [253, 126, 20],
  yellow: [250, 176, 5],
  green: [64, 192, 87],
  cyan: [21, 170, 191],
  blue: [34, 139, 230],
  purple: [121, 80, 242],
  gray: [134, 142, 150]
};

export type EColor = keyof typeof COLOR_RGB_MAP;

export const getColorRGB = (colorName: EColor) => {

  return COLOR_RGB_MAP[colorName] || []; // 如果颜色名无效，则返回空数组
};

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