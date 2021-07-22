const express = require("express");
const Product = require("./models");
require("./db");
const EmailValidator = require('email-deep-validator');


const app = express();
app.use(express.json());
const emailValidator = new EmailValidator();


app.get('/', (req, res) => {

    return res.send("Hello!!");
})

app.post('/api/products', async (req, res) => {

    try {
        const product = new Product({
            name: req.body.name,
            email: req.body.email
        })
        const { wellFormed, validDomain, validMailbox } = await emailValidator.verify(req.body.email);
        if (wellFormed && validDomain && validMailbox) {
            await product.save();
            return res.status(201).send(product);
        }
        else {
            throw 'Invalid Email';
        }

    } catch (e) {
        return res.status(500).send("Server error " + e)

    }
})

app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        return res.status(200).send(products);
    } catch (e) {
        return res.status(500).send(e)
    }
})

app.get('/api/products/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const products = await Product.findById(_id);
        return res.status(200).send(products);
    } catch (e) {
        return res.status(500).send(e)
    }
});

app.patch('/api/products/:id', async (req, res) => {
    const _id = req.params.id
    try {
        if (req.body.email !== undefined) {
            const { wellFormed, validDomain, validMailbox } = await emailValidator.verify(req.body.email);
            if (!(wellFormed && validDomain && validMailbox)) {
                throw 'Invalid Email';
            }
        }
        const products = await Product.findByIdAndUpdate(_id, req.body)
        if (products) {
            const productUp = await Product.findById(_id);
            return res.status(200).send(productUp)
        }
        else {
            return res.status(400).send("Update Failed")
        }
    } catch (e) {
        return res.status(500).send(e)
    }
})

app.delete('/api/products/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const product = await Product.findByIdAndDelete(_id);
        if (product) {
            return res.status(400).send("Product Succesfully deleted")
        }
        return res.send("Product deletion failed");
    } catch (e) {
        return res.status(500).send(e)
    }
})


app.listen(3000, () => console.log("Listening on 3000"))