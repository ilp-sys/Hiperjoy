import { create } from "xmlbuilder2";

export const buildXml = <T>(rootElementName: string, data: T): string => {
  const xmlObj = { [rootElementName]: data };

  const xml = create({ version: "1.0", encoding: "UTF-8", standalone: "no" })
    .ele(xmlObj)
    .end({ prettyPrint: true });

  return xml;
};
