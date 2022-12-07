const express = require('express')
const { default: mongoose } = require('mongoose')
const controller = express.Router()
// let products = require('../data/simulated_database_products')
const { v4: uuidv4 } = require('uuid')
const { listIndexes } = require('../schemas/productSchema')

const productSchema = require('../schemas/productSchema')

controller.param("id", async (req, res, next, id) => {
    req.product = await productSchema.findById(id)
    req.product = ({
        articleNumber: req.product._id.toString(),
        name: req.product.name,
        category: req.product.category,
        description: req.product.description,
        rating: req.product.rating,
        price: req.product.price,
        tag: req.product.tag,
        imageName: req.product.imageName
    })
    

    next()
})

// POST - CREATE PRODUCT
controller.post('/', (req, res) => {
    let product = {
        // _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        category: req.body.category,
        description: req.body.description,
        rating: req.body.rating,
        price: req.body.price,
        tag: req.body.tag,
        imageName: req.body.imageName,
    }
    productSchema.create(product)  
    console.log("product created") 
    res.status(201).json(product)
}) 


// GET - READ - HÄMTA ALLA ELLER NÅGRA PRODUKTER / FILTRERA MED TAGS - http://localhost:5000/api/products
controller.get('/', async (req, res) => {
            const { take, tag } = req.query
            let sortedProducts = []
            let products = [...(await productSchema.find())]
            if(products) {
                for(let product of products) {
                    sortedProducts.push({
                        articleNumber: product._id,
                        name: product.name,
                        category: product.category,
                        description: product.description,
                        rating: product.rating,
                        price: product.price,
                        tag: product.tag,
                        imageName: product.imageName
                    })
                }
                if(tag) {
                    sortedProducts = sortedProducts.filter(product => product.tag == tag)
                }
    
                if( take > 0){
                    sortedProducts = sortedProducts.slice(0, Number(take))
                } 
    
                res.status(200).json(sortedProducts)
            } else {
                res.status(400).json()
            }

})


// GET - READ - HÄMTA EN PRODUKT - http://localhost:5000/api/products
controller.route('/:id').get((req, res) => {
    if (req.product != undefined){
        res.status(200).json(req.product)
    } else {    
        res.status(404).json() 
    }
})


// PUT - UPDATE PRODUCT
controller.route('/:id').put((req, res) => {
    if(req.product != undefined){
        let product = req.product 

        product.name = req.body.name ? req.body.name : product.name
        product.category = req.body.category ? req.body.category : product.category
        product.description = req.body.description ? req.body.description : product.description
        product.rating = req.body.rating ? req.body.rating : product.rating
        product.price = req.body.price ? req.body.price : product.price
        product.tag = req.body.tag ? req.body.tag : product.tag
        product.imageName = req.body.imageName ? req.body.imageName : product.imageName

        console.log("product updated")
        console.log(product)
        res.status(200).json(product)
    }
    else
        res.status(404).json()
    })


// DELETE - DELETE PRODUCT
controller.route('/:id').delete(async (req, res) => {
    if(req.product != undefined){
        await productSchema.remove(req.product)
        res.status(204).json() 
    }
    else {
        res.status(404).json()
    }
}) 

module.exports = controller 