const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cord')

const app = express()
const {APP_PORT} = process.env

app.use(bodyParser.urlencoded({extended: false}))
app.use(morgan('dev'))
app.use(cors())

app.get('/', (req, res) => {
  res.send({
    success: true,
    message: 'Backend is running well'
  })
})

app.listen(APP_PORT, ()=>{
  console.log(`App listen on port ${APP_PORT}`)
})
