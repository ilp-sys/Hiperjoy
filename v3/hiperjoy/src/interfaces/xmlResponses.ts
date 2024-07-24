interface Instance {
  id: string;
  position: string;
  size: string;
  rotation: string;
  transparency: string;
  rgb: string;
  bw: string;
  mosaic: string;
  layer: string;
  showlabel: string;
  borderRGB: string;
  bordervis: string;
}

interface ContentObject {
  type: string;
  name: string;
  width: string;
  height: string;
  uuid?: string;
  said?: string;
  label: string;
  Instance: Instance[];
}

interface Wall {
  name: string;
  left: number;
  top: number;
  width: number;
  height: number;
  color: string;
  wallgridh?: number;
  wallgridv?: number;
}

interface ObjectsResponse {
  Objects: {
    Object: ContentObject[];
  };
}

export type { ObjectsResponse, ContentObject, Instance, Wall };
