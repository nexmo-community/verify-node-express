const express = require('express')
const app = require('express')()
const nunjucks = require('nunjucks')
const Nexmo = require('nexmo')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
nunjucks.configure('views', { express: app })

const nexmo = new Nexmo({
  apiKey: process.env.NEXMO_KEY,
  apiSecret: process.env.NEXMO_SECRET
})

app.get('/', (req, res) => {
  res.render('index.html', { message: 'Hello, world!' })
})

app.post('/verify', (req, res) => {
  nexmo.verify.request({
    number: req.body.number,
    brand: 'ACME Corp'
  }, (error, result) => {
    if(result.status != 0 && result.status != 10) {
      res.render('index.html', { message: result.error_text })
    } else {
      res.render('check.html', { requestId: result.request_id })
    }
  })
})

app.post('/check', (req, res) => {
  nexmo.verify.check({
    request_id: req.body.requestId,
    code: req.body.code
  }, (error, result) => {
    if(result.status != 0) {
      res.render('index.html', { message: result.error_text })
    } else {
      res.render('success.html')
    }
  })
})

app.listen(3000)