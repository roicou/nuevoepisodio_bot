import config from "@/config";
import CalendarInterface from "@/interfaces/calendar.interface";
import logger from "@/libs/logger";
import axios from "axios";
import { DateTime, Settings } from "luxon";
import calendarModel from "@/models/calendar.model";
Settings.defaultZone = config.timezone;
class PlaymaxService {
    //https://playmax.mx/api/json/get/calendar/v1/17f7c615f8fdfb71d5bd0aec/f3b5139e3f79627d35de99ad884401b24370205d/?type=all&fichaType=1&releaseCountry=2&firstRelease=true&year=2023&month=1&releaseType=2,3&releaseLang=1
    public async nextReleases(): Promise<any> {
        logger.info("Updating calendar from Playmax...")
        const local = DateTime.local();
        const data: CalendarInterface[] = [];
        const shows = {};
        const bulk = [];
        for (let i = 0; i < 2; i++) {
            const year = local.plus({ months: i }).year;
            const month = local.plus({ months: i }).month;
            logger.info(`Getting calendar from ${year}-${month}...`);
            const url = `${config.playmax.url}/get/calendar/v1/${config.playmax.api_key}/${config.playmax.auth_key}/?type=all&fichaType=1&releaseCountry=${config.playmax.country}&firstRelease=true&year=${year}&month=${month}&releaseType=2,3&releaseLang=${config.playmax.lang}`;
            // get the data from the api with axios
            const response = await axios.get(url);

            if (response?.data?.error.code === 0) {
                for (const day of response.data.result.days) {
                    if (DateTime.fromObject({ year: year, month: month, day: day.day }).startOf('day') <= local.minus({days: 1}).startOf('day')) {
                        continue;
                    }
                    for (const show of day.releases) {
                        if (!show.ficha.isSerie) {
                            continue;
                        }
                        if (shows[`${show.ficha.id}-${show.ficha.episode.season}x${show.ficha.episode.episode}`] === undefined) {
                            shows[`${show.ficha.id}-${show.ficha.episode.season}x${show.ficha.episode.episode}`] = [];
                        }
                        shows[`${show.ficha.id}-${show.ficha.episode.season}x${show.ficha.episode.episode}`].push(show);
                    }
                }
                for (const key in shows) {
                    const lang_list = shows[key];
                    if (lang_list.length) {
                        let final_show = lang_list.find((lang) => lang.lang === config.playmax.lang);
                        if (!final_show) {
                            final_show = lang_list.find((lang) => lang.lang === 7);
                        }
                        if (!final_show) {
                            final_show = lang_list.find((lang) => lang.lang === 0);
                        }
                        if (!final_show) {
                            final_show = lang_list[0];
                        }
                        data.push({
                            id_playmax: final_show.ficha.id,
                            title: final_show.ficha.title,
                            season: final_show.ficha.episode.season,
                            episode: final_show.ficha.episode.episode,
                            date: DateTime.fromSeconds(final_show.date.unix).toJSDate()
                        })
                    }
                }
                // save to calendar
            } else {
                throw new Error(response?.data?.error.message || "Can't get the data from Playmax");
            }
        }
        // upsert data on calendarModel
        logger.info("Upserting calendar...");
        for (const show of data) {
            bulk.push({
                updateOne: {
                    filter: {
                        id_playmax: show.id_playmax,
                        season: show.season,
                        episode: show.episode
                    },
                    update: {
                        title: show.title,
                        date: show.date
                    },
                    upsert: true,
                    new: true,
                    setDefaultsOnInsert: true
                }
            });
        }
        const res = await calendarModel.bulkWrite(bulk);
        logger.info("Done. Calendar updated: " + res.upsertedCount + " new shows added.");
    }

    public async deleteOldReleases(): Promise<any> {
        const date = DateTime.local();
        logger.info("Deleting old releases from calendar...");
        await calendarModel.deleteMany({ date: { $lt: date.toJSDate() } });
        logger.info("Done. Old releases deleted.");
    }

    public async getCalendarByTitle(title: string): Promise<CalendarInterface> {
        return await calendarModel.findOne({ title: title }, {}, { sort: { date: 1 } });
    }

}
export default new PlaymaxService();