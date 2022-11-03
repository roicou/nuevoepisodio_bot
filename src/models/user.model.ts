// model for user.interface

import { Schema, model, Document } from 'mongoose';
import UserInterface from '@/interfaces/user.interface';

export default model<UserInterface>('User', new Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    shows: {
        type: [String],
        required: false,
        default: [],
    },
    config: {
        language: {
            type: String,
            required: false,
            default: 'en',
        },
        active: {
            type: Boolean,
            required: false,
            default: true,
        },
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