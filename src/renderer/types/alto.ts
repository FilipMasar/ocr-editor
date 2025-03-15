// ALTO document type definitions based on ALTO v3.1 schema

// Basic position and dimension attributes shared by many elements
export interface AltoBasicAttributes {
  ID?: string;
  STYLEREFS?: string;
  HPOS?: number | string;
  VPOS?: number | string;
  WIDTH?: number | string;
  HEIGHT?: number | string;
  ROTATION?: number | string;
}

// String element
export interface AltoString extends AltoBasicAttributes {
  CONTENT: string;
  WC?: number | string; // Word confidence
  CC?: string; // Character confidence
  SUBS_TYPE?: string;
  SUBS_CONTENT?: string;
  LANG?: string;
  CS?: string; // Correction status
}

// String element as it appears in the JSON
export interface AltoStringJson {
  '@_ID'?: string;
  '@_STYLEREFS'?: string;
  '@_HPOS'?: string;
  '@_VPOS'?: string;
  '@_WIDTH'?: string;
  '@_HEIGHT'?: string;
  '@_CONTENT': string;
  '@_WC'?: string;
  '@_CC'?: string;
  '@_SUBS_TYPE'?: string;
  '@_SUBS_CONTENT'?: string;
  '@_LANG'?: string;
  '@_CS'?: string;
}

// Space element
export type AltoSpace = AltoBasicAttributes

// Space element as it appears in the JSON
export interface AltoSpaceJson {
  '@_ID'?: string;
  '@_STYLEREFS'?: string;
  '@_HPOS'?: string;
  '@_VPOS'?: string;
  '@_WIDTH'?: string;
  '@_HEIGHT'?: string;
}

// Hyphen element
export interface AltoHyphen {
  '@_CONTENT'?: string;
}

// TextLine element
export interface AltoTextLine extends AltoBasicAttributes {
  String?: AltoString | AltoString[];
  SP?: AltoSpace | AltoSpace[];
  HYP?: AltoHyphen;
  LANG?: string;
  CS?: string;
}

// TextLine element as it appears in the JSON
export interface AltoTextLineJson {
  '@_ID'?: string;
  '@_STYLEREFS'?: string;
  '@_HPOS'?: string;
  '@_VPOS'?: string;
  '@_WIDTH'?: string;
  '@_HEIGHT'?: string;
  '@_ROTATION'?: string;
  '@_LANG'?: string;
  '@_CS'?: string;
  String?: AltoStringJson | AltoStringJson[];
  SP?: AltoSpaceJson | AltoSpaceJson[];
  HYP?: AltoHyphen;
}

// TextBlock element
export interface AltoTextBlock extends AltoBasicAttributes {
  TextLine?: AltoTextLine | AltoTextLine[];
  TAGREFS?: string;
  LANG?: string;
  CS?: string;
}

// TextBlock element as it appears in the JSON
export interface AltoTextBlockJson {
  '@_ID'?: string;
  '@_STYLEREFS'?: string;
  '@_HPOS'?: string;
  '@_VPOS'?: string;
  '@_WIDTH'?: string;
  '@_HEIGHT'?: string;
  '@_ROTATION'?: string;
  '@_TAGREFS'?: string;
  '@_LANG'?: string;
  '@_CS'?: string;
  TextLine?: AltoTextLineJson | AltoTextLineJson[];
}

// Illustration element
export interface AltoIllustration extends AltoBasicAttributes {
  TYPE?: string;
  FILEID?: string;
}

// Illustration element as it appears in the JSON
export interface AltoIllustrationJson {
  '@_ID'?: string;
  '@_STYLEREFS'?: string;
  '@_HPOS'?: string;
  '@_VPOS'?: string;
  '@_WIDTH'?: string;
  '@_HEIGHT'?: string;
  '@_ROTATION'?: string;
  '@_TYPE'?: string;
  '@_FILEID'?: string;
}

// GraphicalElement element
export type AltoGraphicalElement = AltoBasicAttributes

// GraphicalElement element as it appears in the JSON
export interface AltoGraphicalElementJson {
  '@_ID'?: string;
  '@_STYLEREFS'?: string;
  '@_HPOS'?: string;
  '@_VPOS'?: string;
  '@_WIDTH'?: string;
  '@_HEIGHT'?: string;
  '@_ROTATION'?: string;
}

// ComposedBlock element
export interface AltoComposedBlock extends AltoBasicAttributes {
  TYPE?: string;
  FILEID?: string;
  TextBlock?: AltoTextBlock | AltoTextBlock[];
  Illustration?: AltoIllustration | AltoIllustration[];
  GraphicalElement?: AltoGraphicalElement | AltoGraphicalElement[];
  ComposedBlock?: AltoComposedBlock | AltoComposedBlock[];
}

// ComposedBlock element as it appears in the JSON
export interface AltoComposedBlockJson {
  '@_ID'?: string;
  '@_STYLEREFS'?: string;
  '@_HPOS'?: string;
  '@_VPOS'?: string;
  '@_WIDTH'?: string;
  '@_HEIGHT'?: string;
  '@_ROTATION'?: string;
  '@_TYPE'?: string;
  '@_FILEID'?: string;
  TextBlock?: AltoTextBlockJson | AltoTextBlockJson[];
  Illustration?: AltoIllustrationJson | AltoIllustrationJson[];
  GraphicalElement?: AltoGraphicalElementJson | AltoGraphicalElementJson[];
  ComposedBlock?: AltoComposedBlockJson | AltoComposedBlockJson[];
}

// PrintSpace element
export interface AltoPrintSpace extends AltoBasicAttributes {
  TextBlock?: AltoTextBlock | AltoTextBlock[];
  Illustration?: AltoIllustration | AltoIllustration[];
  GraphicalElement?: AltoGraphicalElement | AltoGraphicalElement[];
  ComposedBlock?: AltoComposedBlock | AltoComposedBlock[];
}

// PrintSpace element as it appears in the JSON
export interface AltoPrintSpaceJson {
  '@_ID'?: string;
  '@_STYLEREFS'?: string;
  '@_HPOS'?: string;
  '@_VPOS'?: string;
  '@_WIDTH'?: string;
  '@_HEIGHT'?: string;
  '@_ROTATION'?: string;
  TextBlock?: AltoTextBlockJson | AltoTextBlockJson[];
  Illustration?: AltoIllustrationJson | AltoIllustrationJson[];
  GraphicalElement?: AltoGraphicalElementJson | AltoGraphicalElementJson[];
  ComposedBlock?: AltoComposedBlockJson | AltoComposedBlockJson[];
}

// Margin elements
export interface AltoMargin extends AltoBasicAttributes {
  TextBlock?: AltoTextBlock | AltoTextBlock[];
  Illustration?: AltoIllustration | AltoIllustration[];
  GraphicalElement?: AltoGraphicalElement | AltoGraphicalElement[];
  ComposedBlock?: AltoComposedBlock | AltoComposedBlock[];
}

// Margin elements as they appear in the JSON
export interface AltoMarginJson {
  '@_ID'?: string;
  '@_STYLEREFS'?: string;
  '@_HPOS'?: string;
  '@_VPOS'?: string;
  '@_WIDTH'?: string;
  '@_HEIGHT'?: string;
  TextBlock?: AltoTextBlockJson | AltoTextBlockJson[];
  Illustration?: AltoIllustrationJson | AltoIllustrationJson[];
  GraphicalElement?: AltoGraphicalElementJson | AltoGraphicalElementJson[];
  ComposedBlock?: AltoComposedBlockJson | AltoComposedBlockJson[];
}

// Page element
export interface AltoPage {
  ID?: string;
  PHYSICAL_IMG_NR?: string;
  PRINTED_IMG_NR?: string;
  QUALITY?: string;
  QUALITY_DETAIL?: string;
  POSITION?: string;
  PROCESSING?: string;
  PC?: string;
  WIDTH?: number | string;
  HEIGHT?: number | string;
  TopMargin?: AltoMargin;
  LeftMargin?: AltoMargin;
  RightMargin?: AltoMargin;
  BottomMargin?: AltoMargin;
  PrintSpace?: AltoPrintSpace;
}

// Page element as it appears in the JSON
export interface AltoPageJson {
  '@_ID'?: string;
  '@_PHYSICAL_IMG_NR'?: string;
  '@_PRINTED_IMG_NR'?: string;
  '@_QUALITY'?: string;
  '@_QUALITY_DETAIL'?: string;
  '@_POSITION'?: string;
  '@_PROCESSING'?: string;
  '@_PC'?: string;
  '@_WIDTH'?: string;
  '@_HEIGHT'?: string;
  TopMargin?: AltoMarginJson;
  LeftMargin?: AltoMarginJson;
  RightMargin?: AltoMarginJson;
  BottomMargin?: AltoMarginJson;
  PrintSpace?: AltoPrintSpaceJson;
}

// Layout element
export interface AltoLayout {
  Page?: AltoPage | AltoPage[];
}

// Layout element as it appears in the JSON
export interface AltoLayoutJson {
  Page?: AltoPageJson | AltoPageJson[];
}

// Style definitions
export interface AltoTextStyle {
  ID: string;
  FONTFAMILY?: string;
  FONTSIZE?: number | string;
  FONTCOLOR?: string;
  FONTSTYLE?: string;
}

export interface AltoTextStyleJson {
  '@_ID': string;
  '@_FONTFAMILY'?: string;
  '@_FONTSIZE'?: string;
  '@_FONTCOLOR'?: string;
  '@_FONTSTYLE'?: string;
}

export interface AltoParagraphStyle {
  ID: string;
  ALIGN?: string;
  LEFT?: number | string;
  RIGHT?: number | string;
  LINESPACE?: number | string;
  FIRSTLINE?: number | string;
}

export interface AltoParagraphStyleJson {
  '@_ID': string;
  '@_ALIGN'?: string;
  '@_LEFT'?: string;
  '@_RIGHT'?: string;
  '@_LINESPACE'?: string;
  '@_FIRSTLINE'?: string;
}

export interface AltoStyles {
  TextStyle?: AltoTextStyle | AltoTextStyle[];
  ParagraphStyle?: AltoParagraphStyle | AltoParagraphStyle[];
}

export interface AltoStylesJson {
  TextStyle?: AltoTextStyleJson | AltoTextStyleJson[];
  ParagraphStyle?: AltoParagraphStyleJson | AltoParagraphStyleJson[];
}

// Tags definitions
export interface AltoTag {
  ID: string;
  TYPE?: string;
  LABEL?: string;
  DESCRIPTION?: string;
  URI?: string;
}

export interface AltoTagJson {
  '@_ID': string;
  '@_TYPE'?: string;
  '@_LABEL'?: string;
  '@_DESCRIPTION'?: string;
  '@_URI'?: string;
}

export interface AltoTags {
  LayoutTag?: AltoTag | AltoTag[];
  StructureTag?: AltoTag | AltoTag[];
  RoleTag?: AltoTag | AltoTag[];
  NamedEntityTag?: AltoTag | AltoTag[];
  OtherTag?: AltoTag | AltoTag[];
}

export interface AltoTagsJson {
  LayoutTag?: AltoTagJson | AltoTagJson[];
  StructureTag?: AltoTagJson | AltoTagJson[];
  RoleTag?: AltoTagJson | AltoTagJson[];
  NamedEntityTag?: AltoTagJson | AltoTagJson[];
  OtherTag?: AltoTagJson | AltoTagJson[];
}

// Main ALTO document
export interface AltoDocument {
  Description?: any; // For simplicity, not fully defined
  Styles?: AltoStyles;
  Tags?: AltoTags;
  Layout: AltoLayout;
  SCHEMAVERSION?: string;
}

// Main ALTO document as it appears in the JSON
export interface AltoDocumentJson {
  Description?: any; // For simplicity, not fully defined
  Styles?: AltoStylesJson;
  Tags?: AltoTagsJson;
  Layout: AltoLayoutJson;
  '@_SCHEMAVERSION'?: string;
}

// Complete ALTO JSON structure as returned by the parser
export interface AltoJson {
  alto: AltoDocumentJson;
} 