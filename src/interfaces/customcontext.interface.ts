import { Context } from "telegraf"
import UserInterface from "@/interfaces/user.interface";

export default interface CustomContext extends Context {
    user: UserInterface;
}