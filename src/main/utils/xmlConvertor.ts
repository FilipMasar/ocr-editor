import { XMLBuilder, XmlBuilderOptions, XMLParser, XMLValidator } from 'fast-xml-parser';
import { AltoJson } from '../../renderer/types/alto';
import { v4 as uuidv4 } from 'uuid';

// Define validation result type
export interface ValidationResult {
  valid: boolean;
  errors?: string;
}

// Define parse and validate result type
export interface ParseAndValidateResult {
  json: AltoJson | null;
  validation: ValidationResult;
  version?: string;
}

/**
 * Converts XML to JSON with proper attribute handling
 */
export const xmlToJson = (xml: string): AltoJson => {
  try {
    const options = {
      parseAttributeValue: false,
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      allowBooleanAttributes: true,
      alwaysCreateTextNode: false,
    };

    const parser = new XMLParser(options);
    const obj = parser.parse(xml);

    if (!obj.alto) {
      console.warn('Not a valid ALTO document: missing <alto> root element');
    }

    return obj as AltoJson;
  } catch (error) {
    console.error('Error parsing XML:', error);
    // Return a minimal valid structure
    return {
      alto: {
        Layout: {
          '@_CUSTOM_ID': '1',
        },
        '@_CUSTOM_ID': '1',
      },
      '@_CUSTOM_ID': '1',
    };
  }
};

/**
 * Converts JSON back to XML
 */
export const jsonToXml = (json: AltoJson): string => {
  const options: Partial<XmlBuilderOptions> = {
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    format: true,
  };

  const builder = new XMLBuilder(options);

  return builder.build(json);
};

/**
 * Detect the ALTO version from XML content
 * Returns version string (e.g., "3.1") or undefined if not found
 */
export const detectAltoVersion = (xml: string): string | undefined => {
  try {
    // Quick regex approach to find the version
    const versionMatch = xml.match(/ALTO.*?SCHEMAVERSION=["']([^"']+)["']/);
    if (versionMatch && versionMatch[1]) {
      return versionMatch[1];
    }

    // If regex fails, try parsing and checking
    const parsed = xmlToJson(xml);
    return parsed?.alto?.['@_SCHEMAVERSION'];
  } catch (error) {
    console.error('Error detecting ALTO version:', error);
    return undefined;
  }
};

/**
 * Validates basic structure of an ALTO XML document
 * Returns true if valid, or an error message if invalid
 */
export const validateAltoStructure = (xml: string): ValidationResult => {
  try {
    // Basic XML validation
    const basicValidation = XMLValidator.validate(xml, {
      allowBooleanAttributes: true,
    });

    if (basicValidation !== true) {
      return { 
        valid: false, 
        errors: `XML is not well-formed: ${
          typeof basicValidation === 'object' 
            ? JSON.stringify(basicValidation) 
            : basicValidation
        }`
      };
    }

    // Basic structural validation
    const parsedXml = xmlToJson(xml);
    if (!parsedXml.alto) {
      return { valid: false, errors: 'Missing root <alto> element' };
    }
    
    if (!parsedXml.alto.Layout) {
      return { valid: false, errors: 'Missing <Layout> element' };
    }
    
    if (!parsedXml.alto.Layout.Page) {
      return { valid: false, errors: 'Missing <Page> element' };
    }

    // Check for required PrintSpace
    const page = Array.isArray(parsedXml.alto.Layout.Page)
      ? parsedXml.alto.Layout.Page[0]
      : parsedXml.alto.Layout.Page;
      
    if (!page.PrintSpace) {
      return { valid: false, errors: 'Missing <PrintSpace> element' };
    }

    return { valid: true };
  } catch (error) {
    return { 
      valid: false, 
      errors: `Validation error: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

/**
 * Performs basic validation for ALTO v3 documents
 */
export const validateAltoV3 = (xml: string): ValidationResult => {
  try {
    // Check if it's the right version
    const version = detectAltoVersion(xml);
    if (!version || !version.startsWith('3.')) {
      return { 
        valid: false, 
        errors: `Not an ALTO v3 document. Detected version: ${version || 'unknown'}`
      };
    }

    // Check basic structure
    return validateAltoStructure(xml);
  } catch (error) {
    return { 
      valid: false, 
      errors: `Validation error: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

function addCustomIds(json: any): any {
  // Check if json is an array
  if (Array.isArray(json)) {
    json.forEach((item) => addCustomIds(item));
  } else if (json && typeof json === 'object') {
    // Add a new unique ID to the current object
    json['@_CUSTOM_ID'] = generateUniqueId();

    // Iterate over each key (skip the newly added ID to avoid recursion on it)
    Object.keys(json).forEach((key) => {
      if (key !== '@_CUSTOM_ID') {
        addCustomIds(json[key]);
      }
    });
  }
  return json;
}

/**
 * Generates a unique ID using UUID v4
 * @returns {string} A unique ID
 */
function generateUniqueId(): string {
  return uuidv4();
}

export function removeCustomIds(json: any): any {
  if (Array.isArray(json)) {
    // Map over the array, recursively calling removeCustomIds on each item
    return json.map(item => removeCustomIds(item));
  } else if (json && typeof json === 'object') {
    // Create a new object to store the results
    const newObj: { [key: string]: any } = {};
    // Iterate over the keys of the original object
    for (const key in json) {
      // Only copy properties that are not '@_CUSTOM_ID' and belong to the object itself
      if (Object.prototype.hasOwnProperty.call(json, key) && key !== '@_CUSTOM_ID') {
        // Recursively call removeCustomIds on the property's value
        newObj[key] = removeCustomIds(json[key]);
      }
    }
    return newObj;
  }
  // Return primitives or other types unchanged
  return json;
}

/**
 * Parse and validate ALTO XML
 * Returns the parsed JSON and validation info
 */
export const parseAndValidateAlto = (xml: string): ParseAndValidateResult => {
  try {
    const version = detectAltoVersion(xml);
    const json = xmlToJson(xml);
    const jsonWithCustomIds = addCustomIds(json);

    // Validate if it's version 3
    let validation: ValidationResult = { valid: true };
    if (version && version.startsWith('3.')) {
      validation = validateAltoV3(xml);
    } else {
      // Basic structure validation for other versions
      validation = validateAltoStructure(xml);
    }
    
    return {
      json: jsonWithCustomIds,
      validation,
      version
    };
  } catch (error) {
    return {
      json: null,
      validation: { 
        valid: false, 
        errors: `Failed to parse XML: ${error instanceof Error ? error.message : String(error)}`
      }
    };
  }
};
