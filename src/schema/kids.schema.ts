import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { User } from "./user.schema"
import mongoose, { Document } from "mongoose"

export enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE"
}

@Schema()
export class Kids extends Document {
    @Prop({ required: true })
    name: string

    @Prop({ required: true })
    dob: Date

    @Prop({ required: true, enum: Gender })
    gender: Gender

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    parent_user: mongoose.Types.ObjectId;

}
export const kidsSchema = SchemaFactory.createForClass(Kids)