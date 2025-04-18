import { Document } from "mongoose"
import { IKids } from "./kids.interface"
import { Relation, Role } from "src/schema/user.schema"

export interface IUser extends Document{
    name:string
    email:string
    password:string
    relation:Relation
    role?:Role
    children:IKids[]
    createdAt:string
    updatedAt:string
}