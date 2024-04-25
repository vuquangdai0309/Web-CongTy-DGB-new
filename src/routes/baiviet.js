const express = require('express')
const router = express.Router()
const BaiVietController = require('../app/controller/BaiVietController')
const upload = require('../app/middlewares/uploadMilddle')
 const CheckController = require('../app/middlewares/checkout')
router.get('/',CheckController.checkout, BaiVietController.index)

// creat 
router.post('/creat',CheckController.checkout, upload.single('image'), BaiVietController.creat)

//xem chi tiết content
router.get('/:id/detail',CheckController.checkout, BaiVietController.detail)

//xóa 
router.delete('/:id',CheckController.checkout, BaiVietController.delete)

//form edit
router.get('/:id/edit',CheckController.checkout, BaiVietController.edit)

// // //update
router.put('/:id',CheckController.checkout, upload.single('image'), BaiVietController.update)

// // // submit checkbox store
router.post('/handle-form-actions',CheckController.checkout, BaiVietController.handleFormAction)

// // // submit checkbox trash
router.post('/handle-form-actions-trash',CheckController.checkout, BaiVietController.handleFormActionTrash)

// // //xóa vĩnh viễn
router.delete('/:id/force',CheckController.checkout, BaiVietController.forceDestroy)


// // // những bài viết đã xóa
router.get('/trash',CheckController.checkout, BaiVietController.trash)

// // // restore 
router.patch('/:id/restore',CheckController.checkout, BaiVietController.restore)

module.exports = router 