const express = require('express')
const { getScrapedRouter } = require('./router/getScraperResult')

const app = express()
const { authRouter } = require('./router/authenticate')
const cookieParser = require('cookie-parser');
const { profileRouter } = require('./router/profile')
const { apiRouter } = require('./router/apiRouter')

const cors = require('cors');
const connectDB = require('./config/database');


require("dotenv").config();


app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://outrankengine.online',
        'http://outrankengine.online',
        'https://www.outrankengine.online'
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser())

app.use('/', getScrapedRouter)
app.use('/', authRouter)
app.use('/', profileRouter)
app.use('/', apiRouter)




connectDB().then(() => {
    console.log('DB Connected')
    app.listen(1200, () => {

        console.log('server is listening to port 1200')

    })
}).catch((err) => {
    console.log(err, "DB Connection Failed")
})
