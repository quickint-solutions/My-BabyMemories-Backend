import {Prop , Schema , SchemaFactory} from "@nestjs/mongoose"
import { Kids } from "./kids.schema"
import mongoose, { Types } from "mongoose"


export enum Relation{
    MOM = "MOM",
    DAD = "DAD",
    OTHER = "OTHER"
}

export enum Role{
   ACCOUNT_OWNER = "ACCOUNT_OWNER",
   PARTNER = "PARTNER",
}
@Schema()
export class User{
    @Prop({required:true})
    name:string

    @Prop({required:true})
    email:string

    @Prop({required:true})
    password:string

    @Prop({required:true , enum:Relation})
    relation:Relation

    @Prop({ enum:Role})
    role?:Role

    @Prop({ type: [Types.ObjectId], ref: 'Kids', default: [] }) // Change here
    children: Types.ObjectId[];

    @Prop()
    createdAt:Date

    @Prop()
    updatedAt:Date
}
export const UserSchema = SchemaFactory.createForClass(User)