/**
 * show mongoose model
 * @author Roi C. <htts://github.com/roicou/>
 * @license MIT
 */
import { Schema, model } from 'mongoose';
import CalendarInterface from '@/interfaces/calendar.interface';

export default model<CalendarInterface>('Calendar', new Schema<CalendarInterface>(
    {
        id_playmax: {
            type: Number,
            required: true,
        },
        title: {
            type: String,
            required: false,
            default: 'Unknown',
        },
        season: {
            type: Number,
            required: false,
            default: null,
        },
        episode: {
            type: Number,
            required: false,
            default: null,
        },
        date: {
            type: Date || null,
            required: false,
            default: null,
        }
    }, {
    timestamps: true,
    versionKey: false
}
));