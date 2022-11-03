export default interface UserInterface {
    id?: string;
    shows?: string[];
    config?: {
        language?: string;
        active?: boolean;
    },
    createdAt?: Date;
    updatedAt?: Date;
    __v?: number;
}