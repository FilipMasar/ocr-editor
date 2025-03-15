/*
  File for computing word error rate (WER) between original alto and updated alto
*/
import {
  wordErrorRate
} from 'word-error-rate';
import path from 'path';
import fs from 'fs';
import { updateWer } from '../configData';
import { xmlToJson } from './xmlConvertor';
import { AltoJson, AltoTextBlockJson, AltoStringJson, AltoTextLineJson, AltoPrintSpaceJson, AltoPageJson } from '../../renderer/types/alto';

const getTextFromAlto = (altoJson: AltoJson) => {
  // Safely navigate the ALTO structure
  const page = altoJson?.alto?.Layout?.Page;
  if (!page) return '';
  
  // Handle both single page and array of pages
  const firstPage = Array.isArray(page) ? page[0] : page;
  
  // Get PrintSpace from page
  const printSpace = firstPage.PrintSpace;
  if (!printSpace) return '';
  
  // Get TextBlocks from PrintSpace
  let textBlocks = printSpace.TextBlock;
  if (!textBlocks) return '';
  
  // Ensure textBlocks is an array
  if (!Array.isArray(textBlocks)) textBlocks = [textBlocks];

  const text = textBlocks
    .map((textBlock: AltoTextBlockJson) => {
      if (!textBlock.TextLine) return '';

      const textLines = Array.isArray(textBlock.TextLine)
        ? textBlock.TextLine
        : [textBlock.TextLine];

      let words = '';
      for (let i = 0; i < textLines.length; i += 1) {
        const textLine = textLines[i];
        if (!textLine.String) return '';

        const strings = Array.isArray(textLine.String)
          ? textLine.String
          : [textLine.String];

        for (let j = 0; j < strings.length; j += 1) {
          words += strings[j]['@_CONTENT'];
          if (j !== strings.length - 1) words += ' ';
        }

        // If the line ends with a hyphen, don't add a space
        if (i !== textLines.length - 1) {
          if (!textLine.HYP) {
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
