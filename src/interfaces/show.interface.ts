export default interface ShowInterface {
    id?: number;
    name?: string;
    episode?: string | null;
    date?: Date | null;
    service?: string;
    poster_url?: string;
    poster_id?: string;
    createdAt?: Date;
    updatedAt?: Date;
    __v?: number;
}