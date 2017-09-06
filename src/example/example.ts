import ObjectType from "../annotations/object-type";
import GraphQLAnnotations from "../index"
import Field from "../annotations/field";


@ObjectType()
class User
{
    @Field()
    firstName:string;
    @Field()
    lastName:string;

    @Field()
    fullName():string
    {
        return this.firstName + " " + this.lastName;
    }

}

@ObjectType()
class Test
{
    @Field()
    user:User;
    @Field()
    name:string;
    @Field({type:"Int"})
    number:number;
    @Field()
    bool:boolean;
}

@ObjectType()
class Query
{
    constructor()
    {
        this.test = this.test.bind(this);
    }



    @Field()
    test():User
    {
        let user:User = new User();
        user.firstName = "sune";
        user.lastName = "kling";
        return user;
    }
}



let graphqlAnnotations:GraphQLAnnotations = new GraphQLAnnotations();
graphqlAnnotations.init(Query);
graphqlAnnotations.init(User);

console.log(graphqlAnnotations.schema);

let typeDefs = graphqlAnnotations.schema;
let root = graphqlAnnotations.resolvers;

import * as express from "express";
const app = express();

var { graphqlExpress, graphiqlExpress } = require('graphql-server-express');
var { makeExecutableSchema } = require('graphql-tools');
var bodyParser = require('body-parser');

let schema = makeExecutableSchema({typeDefs:typeDefs, resolvers: root});

app.use('/graphql', bodyParser.json(), graphqlExpress({schema:schema}));
app.use('/graphiql', graphiqlExpress({endpointURL: '/graphql'}));

app.listen(4000);