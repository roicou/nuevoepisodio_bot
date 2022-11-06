import CustomContext from "@/interfaces/customcontext.interface";
import userService from "@/services/user.service";
import UserInterface from "@/interfaces/user.interface";
import logger from "@/libs/logger";

export default async (ctx: CustomContext, next: () => void) => {
  const from = ctx.message?.from || ctx.callbackQuery?.from;
  if(ctx.message) {
    logger.debug('ctx.message:');
  } else if(ctx.callbackQuery) {
    logger.debug('ctx.callbackQuery:');
  }
  logger.debug(JSON.stringify(ctx.message || ctx.callbackQuery, null, 2));
  

  if (!from?.id) {
    logger.error("No user id found");
    ctx.reply('No se ha podido obtener tu id de usuario');
    return;
  }
  let user: UserInterface = await userService.getUser(from?.id);
  if (user) {
    ctx.user = user;
    // runs next middleware
  } else {
    user = await userService.createUser(from.id, from.language_code);
    ctx.user = user;
  }
  return next();
};
