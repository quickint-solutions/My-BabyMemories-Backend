import { IUser } from "src/interface/user.interface"
import { Gender } from "src/schema/kids.schema"

export interface IKids{
    name:string
    dob:Date
    gender:Gender
    parent_user:IUser
}