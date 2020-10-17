const Product = require('../../Models/ProductModel')

const { upload, deleteFile } = require('../Utilities/ImageUploader')
const { createProductValidation, updateProductValidation, deleteProductValidation: deleteProductValidator } = require('./Validator')

var ProductController = {
    create: async (req, res) => {
        try {
            await createProductValidation(req.body)
            var notUnique = await Product.findOne({SKU: req.body.SKU})

            if(notUnique != null) {
                deleteFile(req.file.key)
                throw {error: true, mesage: 'SKU is not unique'}
            }

            var prod = new Product({
                SKU: req.body.SKU,
                name: req.body.name,
                quantity: req.body.quantity,
                price: req.body.price,
                desc: req.body.string,
                key: req.file.key,
                imageLocation: req.file.location
            })
            
            await prod.save()
            return res.status(201).json({error: false, message: 'Product created'})
        }
        catch(err) {
            return res.status(400).json(err.details ? err.details[0].message : err)
        }
    },

    update: async (req, res) => {
        try {
            await updateProductValidation(req.body)
            var product = await Product.find({SKU: req.body.SKU})

            if(product.length == 0 || product.length > 1) {
                if(req.file != null)
                    deleteFile(req.file.key)
                
                if(product.length == 0)
                    throw {error: true, mesage: 'SKU not found'}
                else
                    throw {error: true, mesage: 'SKU is not unique'}
            }

            if(req.file != null)
                if(product.key === req.file.key)
                    deleteFile(req.file.key)
            
            product = product[0]

            product = {
                SKU: req.body.SKU || product.SKU,
                name: req.body.name || product.name,
                quantity: req.body.quantity || product.quantity,
                price: req.body.price || product.price,
                desc: req.body.desc || product.desc,
                key: req.file == null ? product.key : req.file.key,
                imageLocation: req.file == null ? product.imageLocation : req.file.location
            }

            await Product.findOneAndUpdate({SKU: product.SKU}, product)
            return res.status(200).json({error: false, message: "Updated"})
        } 
        catch(err) {
            return res.status(400).json(err)
        }
    },

    deleteProduct: async (req, res) => {
        await deleteProductValidator(req.body)
        try {
            var prod = await Product.findOne({SKU: req.body.SKU})
            await deleteFile(prod.key)
            await Product.deleteOne({SKU: prod.SKU})
            return res.status(200).json({error: false, message: "Success"})
        }
        catch(err) {
            return res.status(500).json(err)
        }
    },

    getAll: async (req, res) => {
        try {
            const { page = 1, limit = 10 } = req.query
            const products = await Products.find()
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .exec()

            const count = await Product.countDocuments()

            return res.status(200).json({
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                products
            })
        }
        catch(err) {
            return res.status(500).json({error: true, message: "Something went wrong"})
        }
    },

    search: async (req, res) => {
        try {
            const { page = 1, limit = 10 } = req.query
            var products

            if(req.query.name != null)
                products = await Product.find({ name: { $regex: new RegExp("^" + req.query.name.toLowerCase(), "i") } })
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .exec()

            if(req.query.SKU != null)
                products = await Product.find({ SKU: { $regex: new RegExp("^" + req.query.SKU.toLowerCase(), "i") } })
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .exec()

            const count = await Product.countDocuments()

            return products.length == 0 ? res.status(404).json({error: true, message: "No matching SKU or name"}) 
                : res.status(200).json({
                    totalPages: Math.ceil(count / limit),
                    currentPage: page,
                    products
                })
        }
        catch(err) {
            return res.status(500).json({error: true, message: "Something went wrong"})
        }
    }
}

module.exports = ProductController