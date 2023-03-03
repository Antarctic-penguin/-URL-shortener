const express = require('express')
const router = express.Router()
const urlList = require('../../models/url')
const shortURL = require('../../generateShortURL')
// 主畫面
router.get('/', (req, res) => {
  res.render('index')
})

// 縮址路由
router.post('/shorten', (req, res) => {
  urlList.findOne({ url: req.body.url })
    .lean()
    .then(url => {
      if (url) {
        res.render('finish', { shortUrl: url.shortUrl, id: url._id })
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
                      .catch(error => {
                        console.error(error)
                        res.render('errorPage', { error: error.message })
                      })
                  })
                  .catch(error => {
                    console.error(error)
                    res.render('errorPage', { error: error.message })
                  })
              }
            })
            .catch(error => {
              console.error(error)
              res.render('errorPage', { error: error.message })
            })
        }
        generateURL()
      }
    })
})

//編輯短網址
router.post('/edit/:_id', (req, res) => {
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
        .catch(error => {
          console.error(error)
          res.render('errorPage', { error: error.message })
        })
    })
    .catch(error => {
      console.error(error)
      res.render('errorPage', { error: error.message })
    })
})

// 重新定向
router.get('/:short', (req, res) => [
  urlList.findOne({ shortUrl: `http://localhost:3000/${req.params.short}` })
    .lean()
    .then(url => {
      if (!url) {
        res.render('undefined')
      } else {
        res.redirect(url.url)
      }
    })
    .catch(error => {
      console.error(error)
      res.render('errorPage', { error: error.message })
    })
])

module.exports = router