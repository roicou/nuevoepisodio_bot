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
        if(!user.config.notification_days) {
            user.config.notification_days = 0;
        }
    }
    console.log(users);
    await userService.updateUsers(users);
    console.log("Usuarios actualizados.")
    process.exit();
})();