/**
 * user mongoose model
 * @author Roi C. <htts://github.com/roicou/>
 * @license MIT
 */
import { Schema, model } from 'mongoose';
import UserInterface from '@/interfaces/user.interface';

export default model<UserInterface>('User', new Schema<UserInterface>(
    {
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
            notification_days: {
                type: Number,
                required: false,
                default: 0,
            },
            notification_hour: {
                type: Number,
                required: false,
                default: 10,
            }
        }
    }, {
    timestamps: true,
    versionKey: false
}
));