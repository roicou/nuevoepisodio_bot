/**
 * Script to optimize users collection for new version of the app
 * ! ONLY RUN THIS SCRIPT ONCE !
 * @author Roi C. <https://github.com/roicou/>
 * @version 1.0.0
 * @license MIT
 */
import mongooseLoader from '@/loaders/mongoose.loader';
import userService from '@/services/user.service';

void (async (): Promise<void> => {
    try {
        await mongooseLoader();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
    const users = await userService.getAllUsers();
    console.log('users', users)
    for (const user of users) {
        // transform all user.shows to number
        const shows: number[] = [];
        for (const show of user.shows) {
            if (typeof show === 'string') {
                shows.push(parseInt(show));
            } else {
                shows.push(show);
            }
        }
        user.shows = shows;
        if(!user.config.notification_hour) {
            user.config.notification_hour = 10;
        }
    }
    await userService.updateUsers(users);
    console.log("Usuarios actualizados.")
    process.exit();
})();