const express = require('express')
const router = express.Router();
const { checkAuthenticated, checkNotAuthenticated } = require('../reusable/passport_reuse')
const Product = require('../models/product')
const admin = require("../firebase");
const db = admin.firestore();
const userCollection = db.collection("users");


router.post('/sellForm', checkAuthenticated, async (req, res) => {
    var prod = new Product({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image_: req.body.image,
        quan: req.body.quan,
        seller_id: req.user.id,
        rating: {
            rate: 5,
            count: 0
        }
    })
    await prod.save(async function (err, product) {
        if (err) {
            res.send({ message: 'Product Failed To Be Added', sucess: false, error: err })
            return console.error(err)
        };
        console.log(product.title + " saved to products collection.");
        var products = await userCollection.doc(req.user.username).get()
        products = await products.data()
        if (await products.hasOwnProperty('products')) {
            products.products.push(product.id)
        }
        else {
            products.products = []
            products.products.push(product.id)
        }
        await userCollection.doc(req.user.username).update({ products: products.products }).then((results) => {
            res.send({ message: 'Product Added Successfully', sucess: true })
        }).catch((error) => {
            if (error) {
                console.log(error)
            }
        })
    });
})

router.get('/view_products', checkAuthenticated, async (req, res) => {
    if (req.user.type_of_user == true) {
        var products_fire = await userCollection.doc(req.user.username).get()
        products_fire = products_fire.data()
        products_fire = products_fire.products

        if (products_fire.length != 0) {
            var products = await Promise.all(products_fire.map(async (element, index, array) => {
                return await Product.findById(element).then((result, error) => {
                    if (error){
                        console.log(error)
                        res.send("ran into error", error)

                    }
                    if(result == null){
                        res.send({message:"ran into error", result:result,element })

                    }

                    return (result)
                })
            })
            ).then(result => {
                return result
            })

            res.render('pages/viewRetailerProducts', { title: "View Retailer Products", user: req.user, retailer_products: await products })
        }
        else {
            res.render('pages/viewRetailerProducts', { title: "View Retailer Products", user: req.user, retailer_products: [] })
        }
    }
    else {
        res.redirect('/dashboard')
    }
})


router.get('/view_products_sold', checkAuthenticated, async(req,res)=>{
    
})
router.post('/remove', checkAuthenticated, async (req, res) => {
    Product.findById(req.body.id).remove().then(async (resp, err) => {
        if (err) {
            console.log(err, "ran into something")
            res.send({ success: false, error: err, message: 'Failed to Delete due to a server Side Error' })
        }
        else {
            var resp_fire = await userCollection.doc(req.user.username).get()
            resp_fire = resp_fire.data()
            resp_fire_products = resp_fire.products;

            resp_fire_products.splice(resp_fire_products.indexOf(req.body.id), 1);
            await userCollection.doc(req.user.username).update({ products: resp_fire_products }).then((responce) => {
                res.send({ success: true, error: '', message: 'Deleted Successfully' })
            }).catch((error) => {
                if (error) { console.log(error) }
            })
        }
    })
})

/*router.get('/update_route', checkAuthenticated, async (req, res) => {
    const resp = await Product.find().then(async(result, error) => {
        if (error) console.log(error)
        return result
    })
    await resp.forEach( async element => {
        if (req.user.products.includes(element._id)) {
            console.log(element._id)
        }
        else {
            var response = await Product.findById(element._id)
            response.quan = 10
            response.seller_id = req.user.id
            await response.save().then(
                async (result_mong)=>{
                    userCollection.doc(req.user.username).update({ products: admin.firestore.FieldValue.arrayUnion(result_mong.id)})
                }
            )
        }
    });
    res.send('hmm')
})*/

module.exports = router;