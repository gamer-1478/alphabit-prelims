const express = require('express')
const router = express.Router()
const { checkAuthenticated, checkNotAuthenticated } = require('../reusable/passport_reuse')
const { validateEmail } = require('../reusable/misc_reuse')
const bcrypt = require('bcrypt')
const passport = require("passport");

/*firebase stuff*/
const admin = require("../firebase");
const db = admin.firestore();
const userCollection = db.collection("users");


router.get('/', ((req, res, next) => {
    res.render('pages/index', { title: "hello world" })
}))

router.post("/login", checkNotAuthenticated, passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/signin",
    failureFlash: true,
})
);

router.post('/register', checkNotAuthenticated, async (req, res) => {
    if (!validateEmail(req.body.email)) {
        res.send({ message: "Email Is not valid" })
    }
    else if (req.body.password.length < 6) {
        res.send({ message: "Password Is less than 6 letters." })
    }
    else {
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            var checkIfExists = await userCollection.where('email', '==', req.body.email).get();
            var checkUsername = await userCollection.doc(req.body.username).get()
            if (checkIfExists.docs.length == 0) {
                if (!checkUsername.exists) {
                    await userCollection.doc(req.body.username).set({
                        id: makeid(40),
                        dateCreated: Date.now(),
                        name: req.body.name,
                        username: req.body.username,
                        email: req.body.email,
                        password: hashedPassword
                    })
                    res.send({ message: "Registeration Successful" })
                }
                else {
                    res.send({ message: "account with same username already exists, please take another username" })
                }
            }
            else {
                res.send({ message: "account with same email already exists, please enter another email" })
            }
        } catch (e) {
            console.log(e)
            res.send({ message: "Registeration Failure" })
        }
    }
})

router.delete("/logout", checkAuthenticated, (req, res) => {
    req.logOut();
    res.redirect("/signin");
});

router.get("/signin", checkNotAuthenticated, async (req, res) => {
    res.render("pages/signin.ejs", {
        loggedIn: false,
        title: "SignIn",
    });
});

router.get("/signup", checkNotAuthenticated, async (req, res) => {
    res.render("pages/signup.ejs", {
        loggedIn: false,
        title: "SignUp",
    });
});

function makeid(length) {
    var result = "";
    var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}



module.exports = router;