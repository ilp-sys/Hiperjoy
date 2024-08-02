interface Instance {
  id: string;
  position: string;
  size: string;
  rotation: number;
  transparency: number;
  rgb: string;
  bw: number;
  mosaic: number;
  layer: number;
  audio?: string;
  showlabel: boolean;
  borderRGB: string;
  bordervis: number;
}

interface ContentObject {
  type: string;
  name: string;
  width: number;
  height: number;
  uuid?: string;
  said?: string;
  label?: string;
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
