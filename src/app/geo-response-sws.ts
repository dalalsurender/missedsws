export interface UniqueIdField {
    name: string;
    isSystemMaintained: boolean;
}

export interface SpatialReference {
    wkid: number;
    latestWkid: number;
}

export interface Field {
    name: string;
    type: string;
    alias: string;
    sqlType: string;
    domain?: any;
    defaultValue?: any;
}

export interface Attribute {
    OBJECTID: number;
    STNO: number;
    STPRE: string;
    STNAME: string;
    STTYPE?: any;
    APT: string;
    CITY: string;
    ADDRESS: string;
    SERVICEDAY: string;
    RECYCLE: string;
    GARBAGE: string;
    YARDWASTE: string;
    SER_WEEK?: any;
    CREATED_USER: string;
    CREATED_DATE: number;
    LAST_EDITED_USER: string;
    LAST_EDITED_DATE: number;
}

export interface Geometry {
    x: number;
    y: number;
}

export interface Feature {
    attributes: Attribute;
    geometry: Geometry;
}

export interface GeoResponseSws {
    objectIdFieldName: string;
    uniqueIdField: UniqueIdField;
    globalIdFieldName: string;
    geometryType: string;
    spatialReference: SpatialReference;
    fields: Field[];
    features: Feature[];
}