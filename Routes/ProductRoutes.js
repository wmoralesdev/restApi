const express = require('express')
const router = express.Router()

const { upload } = require('../Controllers/Utilities/ImageUploader')
const ProductController = require('../Controllers/Product/ProductController')

router.get('/search', ProductController.search)
router.get('/', ProductController.getAll)

router.post('/', upload.single('product'), ProductController.create)

router.delete('/', ProductController.deleteProduct)

router.put('/', upload.single('product'), ProductController.update)

module.exports = router