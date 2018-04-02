/**
 * Created by Alexandru on 26-Aug-17.
 */

class UsersController{

    static getUserById(users, id){
        var user;
        users.forEach(function (u) {
            if(u.id === id) {
                user = u;
            }
        });
        return user;
    }


}
module.exports = UsersController;