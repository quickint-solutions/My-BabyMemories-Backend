import { Document } from "mongoose"


export interface IUser extends Document{
    firstName:string
    lastName:string
    email:string
    password:string
    createdAt:string
    updatedAt:string
    provider?: string;
    providerId?: string;
}