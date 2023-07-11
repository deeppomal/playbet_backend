require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const authRoutes = require('./routes/auth-routes')
const passportSetup = require('./config/passport-setup')
const session = require('express-session');
const cookieSession = require('cookie-session')
const passport = require('passport')
const betRoutes = require('./routes/bet-routes')
const cors = require('cors')
const cron = require('./cron-ping');

app.use(cookieSession({
    maxAge:24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY]
}))

app.use(cors())
app.use(passport.initialize())
app.use(passport.session())

mongoose.set("strictQuery",false)
mongoose.connect(process.env.DB_URL)

const db = mongoose.connection

db.on("error",error => console.log(error))
db.on("open",() => console.log('connected to DB'))

// app.use(session({
//     secret: 'SECRET',
//     resave: true,
//     saveUninitialized: true
// }));
app.use(express.json())
app.use('/auth',authRoutes)
app.use('/bet',betRoutes)

app.get('/',(req,res) => {
    res.send('Hello mom')
})

require('./cron-ping')();
require('./cron-serverhit')();

app.listen(4000,()=>console.log('server started'))