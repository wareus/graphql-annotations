import Annotations from "ts-annotations";

export default function Field(fieldConfig?:FieldConfig) {

    if(!fieldConfig)
        fieldConfig={};

    return function(target:any, propertyKey:string)
    {
        Reflect.defineMetadata("Field", fieldConfig, target, propertyKey);
        Annotations.registerProperty(target.constructor.name,propertyKey,"Field")
    }
}

export interface FieldConfig
{
    type?:String
}