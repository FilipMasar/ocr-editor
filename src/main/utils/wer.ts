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

      let words = '';
      for (let i = 0; i < textLines.length; i += 1) {
        if (textLines[i].String === undefined) return '';

        const strings = Array.isArray(textLines[i].String)
          ? textLines[i].String
          : [textLines[i].String];

        for (let j = 0; j < strings.length; j += 1) {
          words += strings[j]['@_CONTENT'];
          if (j !== strings.length - 1) words += ' ';
        }

        // If the line ends with a hyphen, don't add a space
        if (i !== textLines.length - 1) {
          if (textLines[i].HYP === undefined) {
            words += ' ';
          }
        }
      }

      return words;
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
