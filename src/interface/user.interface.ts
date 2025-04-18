import { Document } from "mongoose"
import { IKids } from "./kids.interface"

export interface IUser extends Document{
    firstName:string
    lastName:string
    email:string
    password:string
    createdAt:string
    updatedAt:string
}