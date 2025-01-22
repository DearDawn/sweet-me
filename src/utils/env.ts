export const isPhone =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

export const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
export const isAndroid = /Android/i.test(navigator.userAgent);
export const isWX = /MicroMessenger/i.test(navigator.userAgent);
export const isWideScreen = innerWidth > innerHeight;
