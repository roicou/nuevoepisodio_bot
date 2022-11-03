import { Telegraf } from 'telegraf';
import CustomContext from '@/interfaces/customcontext.interface';
import middleware from '@/bot/middleware';

export default async (bot: Telegraf<CustomContext>) => {
    bot.use(middleware);
    
};