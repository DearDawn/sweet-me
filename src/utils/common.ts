export const safeParse = (jsonString: string, defaultValue?: any) => {
  try {
    const parsedData = JSON.parse(jsonString);
    return parsedData;
  } catch (error) {
    // 解析失败，返回默认值
    return defaultValue ?? jsonString;
  }
};