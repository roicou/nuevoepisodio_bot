/**
 * shows services
 * @author Roi C. <htts://github.com/roicou/>
 * @license MIT
 */
import config from '@/config';
import ShowInterface from '@/interfaces/show.interface';
import showModel from '@/models/show.model';
import { DateTime, Settings } from 'luxon';
import { DeleteResult } from "mongodb";
import { UpdateWriteOpResult } from 'mongoose';

Settings.defaultZone = config.timezone;
class ShowService {
    /**
     * delete shows which are not in shows lists of any user
     * @param shows_to_delete shows ids to delete
     * @returns 
     */
    public async deleteShows(shows_to_delete: number[]): Promise<DeleteResult> {
        return showModel.deleteMany({ id: { $in: shows_to_delete } });
    }

    /**
     * get shows by id
     * @param shows shows to filter
     * @returns 
     */
    public async getShows(shows: (string | number)[]): Promise<ShowInterface[]> {
        return showModel.find({ id: { $in: shows } }, {}, { sort: { name: 1 } });
    }

    /**
     * get a show by id
     * @param id show id
     * @returns 
     */
    public async getShowById(id: number): Promise<ShowInterface> {
        return showModel.findOne({ id });
    }

    /**
     * update or insert (upsert) shows objects in database
     * @param shows_to_upsert
     */
    public async upsertShows(shows_to_upsert: ShowInterface[]) {
        const bulk = [];
        for (const show of shows_to_upsert) {
            const set_or_insert = {
                name: show.name,
                episode: show.episode,
                date: show.date,
                service: show.service,
                poster_url: show.poster_url,
                poster_id: show.poster_id
            }
            bulk.push({
                updateOne: {
                    filter: { id: show.id },
                    update: {
                        $set: set_or_insert,
                        // $setOnInsert: set_or_insert
                    },
                    upsert: true
                }
            });
        }
        showModel.bulkWrite(bulk);
    }

    /**
     * get all shows from database
     * @returns 
     */
    public async getAllShows(): Promise<ShowInterface[]> {
        return showModel.find();
    }

    /**
     * update poster id of a show
     * @param id show id
     * @param poster_id 
     * @returns 
     */
    public async updatePosterId(id: number, poster_id: string): Promise<UpdateWriteOpResult> {
        if (config.debug) {
            return showModel.updateOne({ id }, { poster_debug_id: poster_id });
        }
        return showModel.updateOne({ id }, { $set: { poster_id } });
    }

    /**
     * get shows that have date greater or equal than today
     * @param shows_ids
     * @returns
    */
    public async getNextEpisodes(shows_ids: (string | number)[]): Promise<ShowInterface[]> {
        return showModel.find({ id: { $in: shows_ids }, date: { $gte: DateTime.local().startOf('day').toJSDate() } }, {}, { sort: { date: 1 } });
    }
}
export default new ShowService();