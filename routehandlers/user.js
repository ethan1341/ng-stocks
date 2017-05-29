/**
 *
 * Middleware functions that return/save user information to be called in the routes
 */

var user = {

    /**
     *
     * @param req
     * @param res
     * @param next
     * Checks if the user has been signed in with passport
     */
   isAuthenticated:function (req, res, next) {
        if (req.session.passport) {
            next();
        } else {
          res.send('404')
        }
    },

    /**
     * returns
     * @param req
     * @param res
     * @param next
     * Gets passport session information to be stored in sessionStorage
     */
    getSession:function(req,res,next){
        if (req.user) {
            res.send(req.user)
        } else {
            res.redirect('/#!/login');
        }
    }

};


module.exports.user = user;