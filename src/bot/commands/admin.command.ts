/**
 * admin command
 * @author Roi C. <htts://github.com/roicou/>
 * @license MIT
 */
import config from "@/config";
import CustomContext from "@/interfaces/customcontext.interface";
import logger from "@/libs/logger";
import userService from "@/services/user.service";
import { Message, ApiError } from "telegraf/typings/core/types/typegram";


export default async (ctx: CustomContext): Promise<void> => {
    try {
        const message = ctx.message as Message.TextMessage;
        const args = message.text.split(' ');
        args.shift();
        const text = args.join(' ');
        const users = await userService.getAllUsers();
        for (let user of users) {
            try {
                await ctx.telegram.sendMessage(user.id, text);
            } catch (error) {
                // some fun
            }
        }
    } catch (error) {
        logger.error(error);
    }
}