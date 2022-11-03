import userModel from "@/models/user.model";
import UserInterface from "@/interfaces/user.interface";
import { Document } from "mongoose";
class UserService {

    /**
     * gets user from database
     * @param id telegram id
     * @returns 
     */
    public getUser(id: number): Promise<UserInterface> {
        return userModel.findOne({ id });
    }

}
export default new UserService();