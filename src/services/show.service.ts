import config from '@/config';
import ShowInterface from '@/interfaces/show.interface';
import showModel from '@/models/show.model';
import _, { takeWhile } from 'lodash';
import { DateTime, Settings } from 'luxon';
Settings.defaultZone = config.timezone;
class ShowService {
    public async deleteShows(shows_to_delete: number[]) {
        return showModel.deleteMany({ id: { $in: shows_to_delete } });
    }
    public async getShows(shows: (string | number)[]): Promise<ShowInterface[]> {
        return showModel.find({ id: { $in: shows } }, {}, { sort: { name: 1 } });
    }

    public async getShowById(id: number): Promise<ShowInterface> {
        return showModel.findOne({ id });
    }

    public async upsertShows(shows_to_upsert: ShowInterface[]) {
        const bulk = [];
        for (const show of shows_to_upsert) {
            bulk.push({
                updateOne: {
                    filter: { id: show.id },
                    update: {
                        $set: {
                            name: show.name,
                            episode: show.episode,
                            date: show.date,
                            service: show.service,
                            poster_url: show.poster_url,
                            poster_id: show.poster_id
                        }
                    },
                    upsert: true
                }
            })
        }
        showModel.bulkWrite(bulk);
    }

    public async getAllShows(): Promise<ShowInterface[]> {
        return showModel.find();
    }

    public async updatePosterId(id: number, poster_id: string) {
        return showModel.updateOne({ id }, { $set: { poster_id } });
    }

    public async getNextEpisodes(shows_ids: (string | number)[]): Promise<ShowInterface[]> {
        return showModel.find({ id: { $in: shows_ids }, date: { $gte: DateTime.local().startOf('day').toJSDate() } });
    }
}
export default new ShowService();