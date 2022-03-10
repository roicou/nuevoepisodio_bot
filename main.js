/**
 * Bot de Telegram
 * @author Roi C.
 * @version 1.0.0
 * @license MIT
 */
"use strict";
// REQUIRES EXTERNOS
const fs = require("fs");
const { Telegraf } = require('telegraf');
const cron = require('node-cron');

// REQUIRES LOCALES
if (!fs.existsSync("./config.json")) {
    console.log("No se encontró el archivo de configuración. Copia el archivo config.json.dist y renombralo a config.json");
    process.exit(1);
}
const config = require("./config.json");
const { Connect } = require('./libs/mongodb');
const userService = require('./services/user.service');
const commands = require('./commands/commands.index');
const checkShows = require('./jobs/check_shows.js');

// inicializar el bot
const bot = new Telegraf(config.telegram.token);

// COMANDO /start
bot.start((ctx) => commands.start(ctx));

// MIDDLEWARE
bot.use(async (ctx, next) => {
    const from = ctx.update.message?.from || ctx.update.callback_query?.from;
    const user = await userService.getUser(from?.id);
    if (user) {
        ctx.user = user;
        await next(); // runs next middleware
    }    // runs after next middleware finishes
});

// COMANDOS
bot.command('nueva_serie', (ctx) => commands.nueva_serie.newShow(ctx, bot));
bot.command('series', (ctx) => commands.series(ctx));
bot.command('borrar_serie', (ctx) => commands.borrar_serie.deleteShow(ctx, bot));
bot.command('proximos_estrenos', (ctx) => commands.proximos_estrenos(ctx, bot));
bot.command('detener', (ctx) => commands.detener.stop(ctx));

// Callback para los botones
bot.on('callback_query', async (ctx) => {
    const command = ctx.update.callback_query.data.split("\\")[0];
    commands[command].callback(ctx.update.callback_query.data.substring(command.length + 1), ctx);
});

// on.text
bot.on('text', async (ctx) => {
    const original = ctx.update?.message?.reply_to_message?.text;
    switch(original) {
        case "Escribe el nombre de la serie que quieres añadir":
            commands.nueva_serie.reply(ctx.message.text, ctx);
            break;
    } //switch
});

// CRON schedule para que se envíen cada día los estrenos
cron.schedule('0 15 * * *', () => {
    console.log(new Date(), "Entra el crontab!");
    checkShows(bot);
});

// arranca el programa
Connect() // conectamos a la base de datos
    .then(() => {
        console.log(new Date(), "Base de datos conectada");
        bot.launch(); // inicializamos el bot

        process.once('SIGINT', () => bot.stop('SIGINT'));
        process.once('SIGTERM', () => bot.stop('SIGTERM'));
    })
    .catch(err => {
        console.log(new Date(), "Error conectando con la base de datos: " + err);
        process.exit(1);
    });
