/**
 * user service
 * @author Roi C. <htts://github.com/roicou/>
 * @license MIT
 */
import userModel from "@/models/user.model";
import UserInterface from "@/interfaces/user.interface";
import { DateTime, Settings } from "luxon";
import config from "@/config";
import { UpdateResult } from "mongodb";
import logger from "@/libs/logger";
Settings.defaultZone = config.timezone;
class UserService {
    /**
     * update notification hour
     * @param id telegram id
     * @param hour  
     */
    public async updateUserNotificationTime(id: number, hour: number): Promise<UpdateResult> {
        return userModel.updateOne({ id }, { $set: { "config.notification_hour": hour } });
    }

    /**
     * gets user from database
     * @param telegram_id telegram id
     * @returns 
     */
    public async getUser(telegram_id: number): Promise<UserInterface> {
        // let users = await userModel.find();
        return userModel.findOne({ id: telegram_id });
    }

    /**
     * get all users from database
     * @returns 
     */
    public async getAllUsers(): Promise<UserInterface[]> {
        return userModel.find();
    }

    /**
     * get users that have show in their list and show info
     * @param hour notification hour
     * @returns 
     */
    public async getAllUsersWithShows(hour: number) {
        return userModel.aggregate([
            {
                $match: {
                    shows: { $exists: true, $ne: [] },
                    "config.notification_hour": { $eq: hour }
                }
            },
            {
                // get shows from show collection where id is in user.shows array and show date is today
                $lookup: {
                    from: 'shows',
                    let: { shows: '$shows' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $in: ['$id', '$$shows'] },
                                        { $gte: ['$date', DateTime.local().startOf('day')] },
                                        { $lte: ['$date', DateTime.local().endOf('day')] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'shows'
                }
            },
            {
                // discard users with no shows
                $match: {
                    shows: { $exists: true, $ne: [] }
                }
            }
        ])
    }

    /**
     * updates user in database.
     * 
     * `created for script optimize-users.ts`
     * @param users users to update
     */
    public async updateUsers(users: UserInterface[]): Promise<void> {
        const bulk = [];
        for (const user of users) {
            bulk.push({
                updateOne: {
                    filter: { id: user.id },
                    update: { $set: { shows: user.shows, config: user.config } },
                    upsert: true
                }
            })
        }
        await userModel.bulkWrite(bulk);
    }

    /**
     * creates user in database
     * @param id telegram id
     * @param language_code 
     * @returns 
     */
    public async createUser(id: number, language_code: string): Promise<UserInterface> {
        return userModel.create({
            id,
            shows: [],
            config: {
                notification_hour: 10,
                active: true,
                language: language_code
            }
        });
    }

    /**
     * add show to user
     * @param telegram_id telegram id
     * @param show_id 
     * @returns 
     */
    public async addShow(telegram_id: number, show_id: number): Promise<UpdateResult> {
        return userModel.updateOne({ id: telegram_id }, { $push: { shows: show_id } });
    }

    /**
     * delete show from user
     * @param telegram_id telegram id
     * @param show_id 
     * @returns 
     */
    public async deleteShow(telegram_id: number, show_id: number): Promise<UpdateResult> {
        return userModel.updateOne({ id: telegram_id }, { $pull: { shows: show_id } });
    }
}
export default new UserService();