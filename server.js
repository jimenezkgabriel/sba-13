const express = require('express');
const connectDb = require('./db/connection.js');
const productRoutes = require('./routes/productRoutes.js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

connectDb();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', productRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the Product API');
});

app.listen(PORT, () => {
    console.log(`Server is running in: http://localhost:${PORT}`);
});