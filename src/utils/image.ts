export function changeExtToPNG (imageUrl = '') {
  // 使用正则表达式替换文件名后缀
  const newUrl = imageUrl.replace(/(\.[^./]+$)/, '.png');

  return newUrl;
}

/** 压缩图片 */
export const compressImage = ({
  imgFile,
  imgUrl,
  outputFileName,
  quality,
  scaleSize = Number.POSITIVE_INFINITY,
  scaleRatio = 1,
  targetType = 'png'
}: {
  outputFileName: string,
  /** 【目标为 png 时无效，请使用 scaleSize/scaleRatio 代替】 压缩质量，取值 0, 1 默认 0.92 */
  quality?: number,
  /** 缩放后的大小（以短边计算），默认不缩放 */
  scaleSize?: number;
  /** 缩放比例，0-1, 默认 1 不缩放 */
  scaleRatio?: number;
  /** 输出文件类型，默认 png */
  targetType?: 'png' | 'jpg' | 'jpeg' | 'webp';
} & ({
  imgFile?: File,
  imgUrl: string,
} | {
  imgFile: File,
  imgUrl?: string,
})): Promise<{ file: File, url: string; }> => {
  const targetMIME = `image/${targetType}`;
  return new Promise((resolve, reject) => {
    if (!imgFile && !imgUrl) {
      reject('请传入图片文件或图片URL');
      return;
    }

    const fileURL = imgUrl || URL.createObjectURL(imgFile);

    if (!Number.isFinite(scaleSize) && scaleRatio === 1 && quality === 1) {
      resolve({ file: imgFile, url: fileURL });
      return;
    }

    // 创建一个图片元素
    const img = new Image();

    // 当图片加载完成时
    img.onload = function () {
      // 创建一个canvas元素
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      // 计算缩放后的宽高

      let scaledWidth = scaleRatio > 0 && scaleRatio < 1 ? scaleRatio * img.width : Math.min(scaleSize, img.width);
      let scaledHeight = Math.min(
        (scaledWidth / img.width) * img.height,
        img.height
      );

      if (img.width < img.height) {
        scaledHeight = scaleRatio > 0 && scaleRatio < 1 ? scaleRatio * img.height : Math.min(scaleSize, img.height);
        scaledWidth = Math.min((scaledHeight / img.height) * img.width, img.width);
      }

      // 设置canvas的宽高与图片一致
      canvas.width = scaledWidth;
      canvas.height = scaledHeight;

      // 在canvas上绘制原始图片
      ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);

      // 使用canvas的toDataURL方法来压缩图像
      // 第二个参数为压缩质量，范围为0到1之间
      const compressedDataUrl = canvas.toDataURL(targetMIME, quality);

      // 将Data URL转换为Blob对象
      const byteString = atob(compressedDataUrl.split(',')[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: targetMIME });

      // 构造一个新的File对象
      const compressedFile = new File([blob], outputFileName, {
        type: targetMIME,
      });

      // 调用回调函数，传递压缩后的文件对象
      resolve({ file: compressedFile, url: URL.createObjectURL(compressedFile) });
    };

    img.onerror = function (e) {
      reject(e);
    };

    // 将文件数据赋值给图片元素的src属性
    img.src = fileURL;
  });


};

/** 获取图片 Blob 数据 */
export const getBlob = (imgPath: string): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const c = document.createElement('canvas');
    const ctx = c.getContext('2d');

    image.onload = function () {
      c.width = image.naturalWidth;
      c.height = image.naturalHeight;
      ctx.drawImage(image, 0, 0);
      c.toBlob(resolve, 'image/png');
    };

    image.onerror = reject;
    image.src = imgPath;
  });
};
