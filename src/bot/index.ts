import CustomContext from "@/interfaces/customcontext.interface";
import showsCommand from "@/bot/commands/shows.command";
import nextepisodesCommand from "@/bot/commands/nextepisodes.command";
import { Telegraf } from "telegraf";
import startCommand from "@/bot/commands/start.command";
import newshowCommand from "@/bot/commands/newshow.command";
import deleteshowCommand from "@/bot/commands/deleteshow.command";
export default (bot: Telegraf<CustomContext>) => {
    bot.start(async(ctx:CustomContext) => startCommand(ctx));
    bot.command('series', async(ctx: CustomContext) => showsCommand(ctx));
    bot.command('proximos_estrenos', async(ctx: CustomContext) => nextepisodesCommand(ctx, bot));
    bot.command('nueva_serie', async(ctx: CustomContext) => newshowCommand(ctx));
    bot.command('borrar_serie', async(ctx: CustomContext) => deleteshowCommand(ctx));
    bot.command('ajustes', async(ctx: CustomContext) => ctx.reply('🚧 Comando en desarrollo 🚧'));
}