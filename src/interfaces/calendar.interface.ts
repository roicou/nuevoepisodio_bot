import { ObjectId } from "mongoose";

export default interface CalendarInterface {
    _id?: ObjectId;
    id_playmax?: number;
    title?: string;
    season?: number;
    episode?: number;
    date?: Date;
}