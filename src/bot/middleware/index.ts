import CustomContext from "@/interfaces/customcontext.interface";
import userService from "@/services/user.service";
import UserInterface from "@/interfaces/user.interface";

export default async (ctx: CustomContext, next: () => void) => {
  const from = ctx.message?.from || ctx.callbackQuery?.from;
  if (!from?.id) {
    return next();
  }
  const user: UserInterface = await userService.getUser(from?.id);
  if (user) {
    ctx.user = user;
    await next(); // runs next middleware
  }
};
