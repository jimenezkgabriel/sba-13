const express = require('express');
const Product = require('../models/Product.js');

const router = express.Router();

router.post('/products', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product does not exist' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/products/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product does not exist' });
        }
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/products/:id', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product does not exist' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/products', async (req, res) => {
    try {
        const filter = {};
        let sortOptions = {};
        const { category, minPrice, maxPrice, sortBy, page = 1, limit = 10, inStock } = req.query;

        if (category) {
            filter.category = category;
        };

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        if (sortBy) {
            const sortParams = sortBy.split(':');
            const sortField = sortParams[0];
            const sortOrder = sortParams[1] === 'desc' ? -1 : 1;
            sortOptions = { [sortField]: sortOrder };
        }

        if (inStock) {
            filter.inStock = inStock === 'true';
        }

        const products = await Product.find(filter)
            .sort(sortOptions || {})
            .skip((page - 1) * limit)
            .limit(Number(limit));

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;