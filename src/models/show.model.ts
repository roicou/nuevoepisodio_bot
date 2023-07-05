/**
 * show mongoose model
 * @author Roi C. <htts://github.com/roicou/>
 * @license MIT
 */
import { Schema, model } from 'mongoose';
import ShowInterface from '@/interfaces/show.interface';

export default model<ShowInterface>('Show', new Schema<ShowInterface>(
    {
        id: {
            type: Number,
            required: true,
            unique: true
        },
        name: {
            type: String,
            required: false,
            default: 'Unknown',
        },
        episode: {
            type: String || null,
            required: false,
            default: null,
        },
        date: {
            type: Date || null,
            required: false,
            default: null,
        },
        calendar: {
            type: Boolean,
            required: false,
            default: false,
        },
        service: {
            type: String,
            required: false,
            default: null,
        },
        poster_url: {
            type: String,
            required: false,
            default: null,
        },
        poster_id: {
            type: String,
            required: false,
            default: null,
        },
        poster_debug_id: {
            type: String,
            required: false,
            default: null,
        },
        providers: {
            type: [String],
        }
    }, {
    timestamps: true,
    versionKey: false
}
));