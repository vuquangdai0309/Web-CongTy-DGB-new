const express = require('express')
const router = express.Router()
const HomeController = require('../app/controller/HomeController')
router.use('/bai-viet/:slug', HomeController.baiviet)
router.use('/tin-tuc', HomeController.tintuc)
router.use('/lien-he', HomeController.lienhe)
router.post('/tra-cuu-giay-chung-nhan/search', HomeController.search)
router.use('/tra-cuu-giay-chung-nhan', HomeController.tracuu)
router.get('/tim-kiem', HomeController.timkiem)
router.get('/error', HomeController.error404)
router.use('/', HomeController.index)

module.exports = router