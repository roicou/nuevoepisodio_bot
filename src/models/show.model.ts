import { Schema, model } from 'mongoose';
import ShowInterface from '@/interfaces/show.interface';

export default model<ShowInterface>('Show', new Schema<ShowInterface>({
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
    createdAt: {
        type: Date,
        required: false,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        required: false,
        default: Date.now,
    },
}));