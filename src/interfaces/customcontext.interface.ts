/**
 * customcontext interface
 * @author Roi C. <htts://github.com/roicou/>
 * @license MIT
 */
import { Context } from "telegraf"
import UserInterface from "@/interfaces/user.interface";
import { Message } from "telegraf/typings/core/types/typegram";

export default interface CustomContext extends Context {
    user: UserInterface;
    data: Message.TextMessage;
}