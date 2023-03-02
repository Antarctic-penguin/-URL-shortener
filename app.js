const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const mongoose = require('mongoose')

const port = 3000

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
})
const urlList = require('./models/url')
const shortURL = require('./generateShortURL')
const app = express()
app.engine('hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

// 主畫面
app.get('/', (req, res) => {
  res.render('index')
})

// 縮址路由
app.post('/shorten', (req, res) => {
  urlList.findOne({ url: req.body.url })
    .lean()
    .then(url => {
      if (url) {
        urlList.findOne({ url: req.body.url })
          .lean()
          .then(url => {
            res.render('finish', { shortUrl: url.shortUrl, id: url._id })
          })
          .catch(error => console.error(error))
      } else {
        function generateURL() {
          const checkURL = `http://localhost:3000/${shortURL()}`
          urlList.findOne({ shortUrl: checkURL })
            .lean()
            .then(url => {
              if (url) {
                generateURL()
              } else {
                urlList.create({ url: req.body.url, shortUrl: checkURL })
                  .then(() => {
                    urlList.findOne({ url: req.body.url })
                      .lean()
                      .then((url) => {
                        res.render('finish', { shortUrl: checkURL, id: url._id })
                      })
                      .catch(error => console.error(error))
                  })
                  .catch(error => console.error(error))
              }
            })
            .catch(error => console.error(error))
        }
        generateURL()
      }
    })
})

//編輯短網址
app.post('/edit/:_id', (req, res) => {
  urlList.findById(req.params._id)
    .then(url => {
      urlList.find({ shortUrl: req.body.editUrl })
        .lean()
        .then(checkUrl => {
          if (checkUrl.length === 1) {
            if (checkUrl[0].url === url.url) {
              res.render('finish', { shortUrl: req.body.editUrl, id: req.params._id })
            } else {
              res.render('repeat', { value: url.shortUrl, shortUrl: req.body.editUrl, id: req.params._id })
            }
          } else {
            url.shortUrl = req.body.editUrl
            url.save()
            res.render('finish', { shortUrl: req.body.editUrl, id: req.params._id })
          }
        })
        .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
})

// 重新定向
app.get('/:short', (req, res) => [
  urlList.findOne({ shortUrl: `http://localhost:3000/${req.params.short}` })
    .lean()
    .then(url => {
      if (!url) {
        res.render('undefined')
      } else {
        res.redirect(url.url)
      }
    })
    .catch(error => console.error(error))
])

app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})