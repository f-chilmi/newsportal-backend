const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
const { APP_PORT } = process.env

app.use(bodyParser.urlencoded({ extended: false }))
app.use(morgan('dev'))
app.use(cors())

const tokenAuth = require('./middleware/auth')

const authRoute = require('./routes/auth')
const userRoute = require('./routes/users')
const newsRoute = require('./routes/news')
const bookmarksRoute = require('./routes/bookmarks')
// const publicRoute = require('./routes/publicNews')

app.use('/auth', authRoute)
app.use('/users', tokenAuth, userRoute)
app.use('/news', tokenAuth, newsRoute)
app.use('/bookmarks', tokenAuth, bookmarksRoute)
// app.use('/public', publicRoute)

app.listen(APP_PORT, () => {
  console.log(`App listen on port ${APP_PORT}`)
})
