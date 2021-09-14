function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect("/signin");
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect(`/dashboard`);
    }
    next();
}

module.exports = { checkAuthenticated, checkNotAuthenticated }