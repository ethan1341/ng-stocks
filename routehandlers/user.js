var user = {
   isAuthenticated:function (req, res, next) {
        if (req.user) {
            next();
        } else {
            res.redirect('/');
        }
    },
    checkSession:function(req,res,next){
        if (req.user) {
            res.send(req.user)
        } else {
            res.redirect('/#!/login');
        }
    }

};


module.exports.user = user;