/* eslint-disable no-restricted-globals */

export const toNumber = (value: any) => {
  if (value === null || value === undefined) return value;

  const n = Number(value);
  return isNaN(n) ? 0 : n;
};

/*
 * Get text from TextLine element
 */
export const getStringsFromLine = (textLine: any): string[] | string => {
  if (textLine?.String) {
    if (Array.isArray(textLine.String)) {
      return textLine.String.map((s: any) => s['@_CONTENT']);
    }
    return textLine.String['@_CONTENT'];
  }
  return '';
};

/*
 * add metadata - index, STYLEREFS and other (custom) data to each element
 */
export const addMetadata = (
  element: any,
  parentStyleRefs?: string,
  otherMetadata?: Record<string, any>
) => {
  if (Array.isArray(element)) {
    return element.map((e, i) => ({
      element: e,
      metadata: {
        ...otherMetadata,
        index: i,
        '@_STYLEREFS': e['@_STYLEREFS'] || parentStyleRefs,
      },
    }));
  }
  return [
    {
      element,
      metadata: {
        ...otherMetadata,
        index: -1,
        '@_STYLEREFS': element['@_STYLEREFS'] || parentStyleRefs,
      },
    },
  ];
};
