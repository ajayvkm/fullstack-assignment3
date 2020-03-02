const express = require('express');
const {ApolloServer, UserInputError } = require('apollo-server-express');
const fs = require('fs');

let aboutMessage = "Product Inventory API v1.1";

const resolvers = {
    Query: {
        about: () => aboutMessage,
        allProducts,
    },
    Mutation: {
        setAboutMessage,
        addProduct,
    },
};

function addProduct(_, { product }) {
    product.id = productDB.length + 1;
    if (product.category == undefined) product.category = Category.Accessories;
    productDB.push(product);
    return product;
}


function setAboutMessage(_, {message}) {
    return aboutMessage = message;
}

function allProducts() {
    return productDB;
}

const productDB = [];

const server = new ApolloServer({
   typeDefs : fs.readFileSync('./server/schema.graphql', 'utf-8'),
   resolvers,
    formatError: error => {
       console.log(error);
       return error;
    }
});

const app = express();

app.use(express.static('public'));

server.applyMiddleware({app, path: '/graphql'});

app.listen(3000, function () {
    console.log('App started on port 3000 with graphql');
});