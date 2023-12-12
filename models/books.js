const mongoose = require('mongoose');

const bookScheme = mongoose.Schema({
    id: {
        type: Number,
        unique: true
    },
    title: {
        type: String,
        required: true,
    },
    authors: {
        type: String,
        required: true
    },
    categories: {
        type: String,
        required: true
    },
    pageCount: {
        type: Number,
        required: true
    },
    shortDescription: {
        type: String
    },
    thumbnailUrl: {
        type: String,
    },
})
module.exports = mongoose.model('book', bookScheme);


// {
//             id: 1,
//             title: 'Book 1',
//             authors: 'Author 1',
//             categories: 'Category 1',
//             pageCount: 200,
//             shortDescription: 'Short description for Book 1',
//             thumbnailUrl: 'https://example.com/book1.jpg',
//         },