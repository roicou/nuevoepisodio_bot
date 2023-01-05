/**
 * TMDB services
 * @author Roi C. <htts://github.com/roicou/>
 * @license MIT
 */
import config from '@/config';
import userService from '@/services/user.service';
import _ from 'lodash';
import axios from 'axios';
import showService from './show.service';
import ShowInterface from '@/interfaces/show.interface';
import { DateTime, Settings } from 'luxon';
import logger from '@/libs/logger';
Settings.defaultZone = config.timezone;
class TMDBService {
    /**
     * search shows by name in TMDB and return all results
     * @param show_name 
     * @returns 
     */
    public async getShowsByName(show_name: string): Promise<any> {
        // characters like 'á' or 'ñ' are not common in english, so we change them to 'a' or 'n', so we can search them
        show_name = this.changeNoCommonCharacters(show_name);
        const url = config.tmdb.url + "/search/tv?api_key=" + config.tmdb.api_key + "&language=es-ES&page=1&query=" + show_name;
        try {
            const response = await axios.get(url);
            return response.data;
        } catch (err) {
            err.message += '\n\nURL:' + url;
            throw err;
        }
    }

    /**
     * change characters that are not common in english
     * @param text 
     * @returns 
     */
    private changeNoCommonCharacters(text: string): string {
        return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    /**
     * Search new episodes in TMDB and update shows in database
     */
    public async updateShows(): Promise<void> {
        logger.info("Updating shows...");
        const users = await userService.getAllUsers();
        // get shows array from users.shows and flatten it to one array and remove duplicates
        const user_shows: number[] = _.uniq(_.flatten(users.map(user => user.shows)));
        const datas = [];
        const db_shows: ShowInterface[] = await showService.getAllShows();
        for (const show of user_shows) {
            try {
                const data = await this.updateInfoShow(show, db_shows);
                datas.push(data);
            } catch (err) {
                logger.error(err);
                continue;
            }
            
        }
        // search db_shows which are not in datas and delete them
        const db_shows_ids = db_shows.map(show => show.id);
        const datas_ids = datas.map(show => show.id);
        const shows_to_delete = _.difference(db_shows_ids, datas_ids);
        logger.info("Deleting shows: " + shows_to_delete);
        await showService.deleteShows(shows_to_delete);
        await showService.upsertShows(datas);
        logger.info("Updating shows done.")
    }

    public async updateInfoShow(show_id: number, db_shows: ShowInterface[]): Promise<{id: number; name: string; episode: string; date: Date, service: string; poster_url: string; poster_id: string; poster_debug_id: string}> {
            const show_info = await this.getShowById(show_id);
            // prepare data to upsert
            const date = show_info.next_episode_to_air ? show_info.next_episode_to_air.air_date : show_info.last_episode_to_air ? show_info.last_episode_to_air.air_date : null;
            // show_info.next_episode_to_air ? show_info.next_episode_to_air.season_number + "x" + (show_info.next_episode_to_air.episode_number > 9) ? show_info.next_episode_to_air.episode_number : '0' + show_info.next_episode_to_air.episode_number : show_info.last_episode_to_air ? show_info.last_episode_to_air.season_number + "x" + show_info.last_episode_to_air.episode_number > 9 ? show_info.last_episode_to_air.episode_number : '0' + show_info.last_episode_to_air.episode_number : null
            let episode: string;
            if (show_info.next_episode_to_air) {
                episode = show_info.next_episode_to_air.season_number + "x" + (show_info.next_episode_to_air.episode_number > 9 ? show_info.next_episode_to_air.episode_number : '0' + show_info.next_episode_to_air.episode_number);
            } else if (show_info.last_episode_to_air) {
                episode = show_info.last_episode_to_air.season_number + "x" + (show_info.last_episode_to_air.episode_number > 9 ? show_info.last_episode_to_air.episode_number : '0' + show_info.last_episode_to_air.episode_number);
            }
            const data = {
                id: show_info.id,
                name: show_info.name,
                episode: episode || null,
                date: date ? DateTime.fromFormat(date, 'yyyy-MM-dd').toJSDate() : null,
                service: show_info.networks.map(network => network.name).join(', '),
                poster_url: show_info.poster_path ? show_info.poster_path : null,
                poster_id: null,
                poster_debug_id: null,
            };
            const db_show = _.find(db_shows, { id: show_info.id });
            if (db_show && db_show.poster_url === show_info.poster_path) {
                data.poster_id = db_show.poster_id;
            }
            return data;
        
    }

    /**
     * get show info by id
     * @param showId 
     * @returns 
     */
    public async getShowById(showId: number | string): Promise<any> {
        // get show from TMDB
        const url = config.tmdb.url + "/tv/" + showId + "?api_key=" + config.tmdb.api_key + "&language=es-ES";
        logger.debug("get show url: " + url);
        // const url = config.tmdb.url + "/tv/on_the_air?api_key=" + config.tmdb.api_key + "&language=es-ES";
        // get petition with axios
        try {
            const response = await axios({
                url: url,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (err) {
            err.message += '\n\nURL:' + url;
            throw err;
        }
    }
}
export default new TMDBService();
