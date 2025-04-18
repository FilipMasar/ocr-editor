import path from 'path';
import fs from 'fs';
import { jsonToXml, parseAndValidateAlto, removeCustomIds } from './xmlConvertor';
import { getImageUri } from './image';
import { AltoJson } from '../../renderer/types/alto';

interface AssetRequestParams {
  imageFileName: string;
  altoFileName: string;
}

interface PageAssetsResult {
  imageUri: string;
  altoJson: AltoJson;
  altoVersion?: string;
  validationStatus: { 
    valid: boolean; 
    errors?: string;
  };
}

interface SaveResult {
  saved: boolean;
  validation: {
    valid: boolean;
    errors?: string;
  };
}

export const getPageAssets = async (
  projectPath: string,
  { imageFileName, altoFileName }: AssetRequestParams
): Promise<PageAssetsResult> => {
  if (imageFileName === undefined || altoFileName === undefined)
    throw new Error('Missing data');

  const imagePath = path.join(projectPath, 'images', imageFileName);
  const altoPath = path.join(projectPath, 'altos', altoFileName);

  const imageUri = getImageUri(imagePath);

  try {
    const altoXml = fs.readFileSync(altoPath, 'utf8');
    
    // Use parseAndValidateAlto for validation, versioning, and conversion
    const { json: altoJson, validation, version } = parseAndValidateAlto(altoXml);
    
    // Log validation issues if any
    if (!validation.valid) {
      console.warn(`ALTO validation issues: ${validation.errors}`);
    }

    // Return enhanced data including version and validation status
    return { 
      imageUri, 
      altoJson, 
      altoVersion: version,
      validationStatus: validation 
    };
  } catch (error) {
    console.error('Error loading ALTO file:', error);
    
    // Return a minimal valid structure with the error in the validation status
    return {
      imageUri,
      altoJson: {
        alto: {
          Layout: {
            '@_CUSTOM_ID': '1',
          },
          '@_CUSTOM_ID': '1',
        },
        '@_CUSTOM_ID': '1',
      },
      validationStatus: {
        valid: false,
        errors: `Failed to load ALTO file: ${error instanceof Error ? error.message : String(error)}`
      }
    };
  }
};

export const saveAlto = async (
  projectPath: string,
  fileName: string,
  alto: AltoJson
): Promise<SaveResult> => {
  const altoPath = path.join(projectPath, 'altos', fileName);
  
  // Validate that alto is a valid object
  if (!alto || typeof alto !== 'object') {
    return { 
      saved: false, 
      validation: { 
        valid: false, 
        errors: 'Invalid ALTO object provided for saving' 
      } 
    };
  }

  // Remove custom IDs from the ALTO object
  const altoWithoutCustomIds = removeCustomIds(alto);

  const xmlContent = jsonToXml(altoWithoutCustomIds);
  
  // Validate before saving
  const { validation } = parseAndValidateAlto(xmlContent);
  if (!validation.valid) {
    console.warn(`Generated ALTO has validation issues: ${validation.errors}`);
  }

  fs.writeFileSync(altoPath, xmlContent);
  
  // Return validation status
  return { saved: true, validation };
};
