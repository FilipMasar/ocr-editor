/* eslint-disable import/prefer-default-export */
import path from 'path';
import fs from 'fs';
import { jsonToXml, xmlToJson } from './utils/xmlConvertor';

export const getPageAssets = async (
  projectPath: string,
  { imageFileName, altoFileName }: any
) => {
  if (imageFileName === undefined || altoFileName === undefined)
    throw new Error('Missing data');

  const imagePath = path.join(projectPath, 'images', imageFileName);
  const altoPath = path.join(projectPath, 'altos', altoFileName);

  let imgMimeType = '';
  switch (imageFileName.split('.').pop()) {
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

  const altoXml = fs.readFileSync(altoPath, 'utf8');
  const altoJson = xmlToJson(altoXml);

  return { imageUri, altoJson };
};

export const saveAlto = async (
  projectPath: string,
  fileName: string,
  alto: any
) => {
  const altoPath = path.join(projectPath, 'altos', fileName);

  const xmlContent = jsonToXml(alto);

  fs.writeFileSync(altoPath, xmlContent);
};
