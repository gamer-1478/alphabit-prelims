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
    successRedirect: "/dashboard",
    failureRedirect: "/signin",
    failureFlash: true,
})
);

router.post('/register', checkNotAuthenticated, async (req, res) => {
    if (!validateEmail(req.body.email)) {
        res.send({ message: "Email Is not valid", success: false })
    }
    else if (req.body.password.length < 6) {
        res.send({ message: "Password Is less than 6 letters.", success: false })
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
                        password: hashedPassword,
                        type_of_user: req.body.type_of_user
                    })
                    res.send({ message: "Registeration Successful", success: true })
                }
                else {
                    res.send({ message: "account with same username already exists, please take another username", success: false })
                }
            }
            else {
                res.send({ message: "account with same email already exists, please enter another email", success: false })
            }
        } catch (e) {
            console.log(e)
            res.send({ message: "Registeration Failure", success: false })
        }
    }
})

router.delete("/logout", checkAuthenticated, (req, res) => {
    req.logOut();
    res.redirect("/signin");
});

router.get("/login", checkNotAuthenticated, async (req, res) => {
    res.render("pages/signin.ejs", {
        loggedIn: false,
        title: "SignIn",
    });
});

router.get("/register", checkNotAuthenticated, async (req, res) => {
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