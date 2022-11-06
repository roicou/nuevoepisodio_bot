import userModel from "@/models/user.model";
import UserInterface from "@/interfaces/user.interface";
import { DateTime, Settings } from "luxon";
import config from "@/config";
import { UpdateResult } from "mongodb";
Settings.defaultZone = config.timezone;
class UserService {

    /**
     * gets user from database
     * @param telegram_id telegram id
     * @returns 
     */
    public async getUser(telegram_id: number): Promise<UserInterface> {
        // let users = await userModel.find();
        return userModel.findOne({ id: telegram_id });
    }

    public async getAllUsers(): Promise<UserInterface[]> {
        return userModel.find();
    }

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

    public async addShow(telegram_id: number, show_id: number): Promise<UpdateResult> {
        return userModel.updateOne({ id: telegram_id }, { $push: { shows: show_id } });
    }
    public async deleteShow(telegram_id: number, show_id: number): Promise<UpdateResult> {
        return userModel.updateOne({ id: telegram_id }, { $pull: { shows: show_id } });
    }
}
export default new UserService();