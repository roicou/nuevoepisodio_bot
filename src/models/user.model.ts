// model for user.interface

import { Schema, model } from 'mongoose';
import UserInterface from '@/interfaces/user.interface';

export default model<UserInterface>('User', new Schema<UserInterface>({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    shows: {
        type: [Number],
        required: false,
        default: [],
    },
    config: {
        language: {
            type: String,
            required: false,
            default: 'es',
        },
        active: {
            type: Boolean,
            required: false,
            default: true,
        },
        notification_hour: {
            type: Number,
            required: false,
            default: 10,
        }
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