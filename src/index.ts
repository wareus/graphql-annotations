import Annotations from "ts-annotations";
import "reflect-metadata";

export default class GarphQLAnnotations
{

    private _schema:string = "";

    private _resolvers:any =  {};

    init(model:any)
    {
        model = Object.create(model.prototype);
        model =  new model.constructor();

        this.initSchema(model);
        this.initResolvers(model);
    }

    initResolvers(model:any)
    {
        Object.getOwnPropertyNames(model).forEach(property=>
        {

            if(Reflect.getMetadata("design:type", model, property).name !== "Function")
            {
                delete model[property];
            }
        });

        this._resolvers[model.constructor.name] = model;
    }

    private initSchema(model:any)
    {

        let schema:string = "";

        let name:string = model.constructor.name;

        let type:string = Reflect.getMetadata("ObjectType", model).type || "type";

        let fields:string ="";



        let properties = this.getProperties(model);


        properties.forEach((property)=>{

            if(Reflect.hasMetadata("Field", model, property))
            {
                let fieldType = this.getTypeOfProperty(model,property);
                fields += "\n" + property + ":"  + fieldType
            }
        });
        schema = `${type} ${name} \n{${fields}\n}`;

        this._schema += schema + "\n";
    }

    private getTypeOfProperty(model:any, property:any):string
    {
        let output:string = Reflect.getMetadata("Field", model, property).type || Reflect.getMetadata("design:type", model, property).name;

        if(output === "Function")
            output = Reflect.getMetadata("design:returntype", model, property).name;

        return output;
    }

    private getProperties(model:any):string[]
    {
        let properties:string[] =[];
        Annotations.get(model.constructor.name).propertyAnnotations.forEach((property, key)=>{
            if(property.has("Field"))
                properties.push(key);
        })

        return properties;
    }

    get schema(): string {
        return this._schema;
    }


    get resolvers(): any {
        return this._resolvers;
    }
}
