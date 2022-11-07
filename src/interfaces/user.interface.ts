/**
 * user interface
 * @author Roi C. <htts://github.com/roicou/>
 * @license MIT
 */
export default interface UserInterface {
    id?: number;
    shows?: number[];
    config?: {
        language?: string;
        active?: boolean;
        notification_hour?: number;
    },
    createdAt?: Date;
    updatedAt?: Date;
    __v?: number;
}