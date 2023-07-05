/**
 * show interface
 * @author Roi C. <htts://github.com/roicou/>
 * @license MIT
 */
export default interface ShowInterface {
    id?: number;
    name?: string;
    episode?: string | null;
    date?: Date | null;
    calendar?: boolean;
    service?: string;
    poster_url?: string;
    poster_id?: string;
    poster_debug_id?: string
    providers?: string[];
    createdAt?: Date;
    updatedAt?: Date;
    __v?: number;
}