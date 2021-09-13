function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect("/signup");
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect(`/${req.user.username}`);
    }
    next();
}

module.exports = {checkAuthenticated, checkNotAuthenticated}