export interface Geodata {
    displayFieldName: string;
    fieldAliases: FieldAliases;
    geometryType: string;
    spatialReference: SpatialReference;
    fields: Field[];
    features: Feature[];
}

export interface FieldAliases {
    ADDRESS: string;
}

export interface SpatialReference {
    wkid: number;
    latestWkid: number;
}

export interface Field {
    name: string;
    type: string;
    alias: string;
    length: number;
}

export interface Attributes {
    ADDRESS: string;
}

export interface Geometry {
    x: number;
    y: number;
}

export interface Feature {
    attributes: Attributes;
    geometry: Geometry;
}
