require('dotenv').config()

//imports
const express = require('express')
const mongoose = require('mongoose')
const expressLayouts = require('express-ejs-layouts');
const app = express()
const path = require('path')

//app.use
app.use(expressLayouts);
app.set('view engine','ejs')
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

const mongoURI = `mongodb+srv://ion05:${process.env.DB_PASS}@cluster0.tidfk.mongodb.net/data?retryWrites=true&w=majority`

mongoose.connect(String(mongoURI), {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then((result) => {
    console.log('Connected to Mongo DB')
    const PORT = process.env.PORT || 3000
    app.listen(PORT, err => {
        console.log(`App listening on ${PORT}`)
        if (err) throw  err
    })
}).catch((err) => console.log(err))

const indexRoute = require('./routes/indexRoute')

app.use(indexRoute)