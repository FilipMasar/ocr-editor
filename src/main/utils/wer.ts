/*
  File for computing word error rate (WER) between original alto and updated alto
*/
import { wordErrorRate } from 'word-error-rate';
import path from 'path';
import fs from 'fs';
import { updateWer } from '../configData';
import { xmlToJson } from './xmlConvertor';

const getTextFromAlto = (altoJson: any) => {
  let textBlocks = altoJson?.alto?.Layout?.Page?.PrintSpace?.TextBlock;
  if (textBlocks === undefined) return '';

  if (!Array.isArray(textBlocks)) textBlocks = [textBlocks];

  const text = textBlocks
    .map((textBlock: any) => {
      if (textBlock.TextLine === undefined) return '';

      const textLines = Array.isArray(textBlock.TextLine)
        ? textBlock.TextLine
        : [textBlock.TextLine];

      const lines = textLines.map((textLine: any) => {
        if (textLine.String === undefined) return '';

        const strings = Array.isArray(textLine.String)
          ? textLine.String
          : [textLine.String];

        const words = strings.map((string: any) => {
          return string['@_CONTENT'];
        });

        return words.join(' ');
      });

      return lines.join(' ');
    })
    .join(' ');

  return text;
};

const calculateWer = (projectPath: string, fileName: string, index: number) => {
  const originalAltoPath = path.join(projectPath, 'original-altos', fileName);
  const originalAltoXml = fs.readFileSync(originalAltoPath, 'utf8');
  const originalAltoJson = xmlToJson(originalAltoXml);
  const originalText = getTextFromAlto(originalAltoJson);

  const altoPath = path.join(projectPath, 'altos', fileName);
  const altoXml = fs.readFileSync(altoPath, 'utf8');
  const altoJson = xmlToJson(altoXml);
  const updatedText = getTextFromAlto(altoJson);

  const wer = wordErrorRate(originalText, updatedText);
  updateWer(projectPath, index, wer);

  return wer;
};

export default calculateWer;
