

export default function ObjectType(typeConfig?:TypeConfig) {

    if(!typeConfig)
        typeConfig = {};

    return function(target: any)
    {
        Reflect.defineMetadata("ObjectType", typeConfig, target.prototype);
    }
}

export interface TypeConfig
{
    type?:String
}

