/**
 * 安全解析 JSON 字符串
 * @param jsonString JSON 字符串
 * @param defaultValue 默认值
 * @returns 解析后的 JSON 对象或默认值
 */
export const safeParse = (jsonString: string, defaultValue?: any) => {
  try {
    const parsedData = JSON.parse(jsonString);
    return parsedData;
  } catch (error) {
    // 解析失败，返回默认值
    return defaultValue ?? jsonString;
  }
};