import { XMLBuilder, XmlBuilderOptions, XMLParser } from 'fast-xml-parser';

export const xmlToJson = (xml: string) => {
  const options = {
    parseAttributeValue: false,
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    allowBooleanAttributes: true,
  };

  const parser = new XMLParser(options);
  const obj = parser.parse(xml);

  return obj;
};

export const jsonToXml = (json: any) => {
  const options: Partial<XmlBuilderOptions> = {
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    format: true,
  };

  const builder = new XMLBuilder(options);

  return builder.build(json);
};
