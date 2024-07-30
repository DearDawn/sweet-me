
export const convertFileSize = (bytes: number) => {
  const kilobyte = 1024;
  const megabyte = kilobyte * 1024;

  if (bytes >= megabyte) {
    return (bytes / megabyte).toFixed(2) + ' MB';
  } else if (bytes >= kilobyte) {
    return (bytes / kilobyte) + ' KB';
  } else if (bytes > 0) {
    return bytes + ' bytes';
  } else {
    return '--';
  }
};
