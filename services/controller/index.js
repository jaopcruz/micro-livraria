const express = require('express');
const shipping = require('./shipping');
const inventory = require('./inventory');
const cors = require('cors');
const reviews = require('./review');

const app = express();
app.use(cors());
app.use(express.json());

/**
 * Retorna a lista de produtos
 * Aceita tanto '/products' quanto '/api/products'
 */
app.get(['/products', '/api/products'], (req, res, next) => {
    inventory.SearchAllProducts(null, (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send({ error: 'something failed :(' });
        } else {
            res.json(data.products);
        }
    });
});

/**
 * Consulta um produto pelo ID
 * Aceita tanto '/product/:id' quanto '/api/product/:id'
 */
app.get(['/product/:id', '/api/product/:id'], (req, res, next) => {
    inventory.SearchProductByID({ id: req.params.id }, (err, product) => {
        if (err) {
            console.error(err);
            res.status(500).send({ error: 'something failed :(' });
        } else {
            res.json(product);
        }
    });
});

/**
 * Consulta o frete
 * Aceita tanto '/shipping/:cep' quanto '/api/shipping/:cep'
 */
app.get(['/shipping/:cep', '/api/shipping/:cep'], (req, res, next) => {
    shipping.GetShippingRate(
        {
            cep: req.params.cep,
        },
        (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).send({ error: 'something failed :(' });
            } else {
                res.json({
                    cep: req.params.cep,
                    value: data.value,
                });
            }
        }
    );
});

app.get('/reviews/:id', (req, res, next) => {
    reviews.GetReviews({ id: req.params.id }, (err, reviewsData) => {
        if (err) {
            console.error(err);
            res.status(500).send({ error: 'Falha ao recuperar avaliações' });
        } else {
            res.json(reviewsData);
        }
    });
});

app.post('/reviews', (req, res, next) => {
    const review = {
        productId: req.body.productId,
        username: req.body.username,
        rating: req.body.rating,
        comment: req.body.comment,
    };

    reviews.AddReview(review, (err, response) => {
        if (err) {
            console.error(err);
            res.status(500).send({ error: 'Falha ao adicionar avaliação' });
        } else {
            res.json(response);
        }
    });
});
/**
 * Inicia o router
 */
app.listen(3000, () => {
    console.log('Controller Service running on http://127.0.0.1:3000');
});