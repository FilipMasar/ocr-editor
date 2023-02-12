import fs from 'fs';

export const getImageUri = (imagePath: string) => {
  let imgMimeType = '';
  switch (imagePath.split('.').pop()) {
    case 'png':
      imgMimeType = 'image/png';
      break;
    case 'jpg':
      imgMimeType = 'image/jpeg';
      break;
    default:
      throw new Error('Invalid image type');
  }

  const encoding = 'base64';
  const imgBase64 = fs.readFileSync(imagePath).toString(encoding);
  const imageUri = `data:${imgMimeType};${encoding},${imgBase64}`;

  return imageUri;
};
