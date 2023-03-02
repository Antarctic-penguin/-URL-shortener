const express = require('express')
const router = express.Router()


const url = require('./modules/url')

router.use('/', url)
// 匯出路由器
module.exports = router