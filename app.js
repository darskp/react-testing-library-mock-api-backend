const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

mongoose.set('strictQuery', false);

const Book = require('./models/books');

require('dotenv').config()

//middlewares
app.use(express.json())
app.use(express.urlencoded({
    extended: false
}));

app.use(cors());
app.post('/addbook', async (req, res) => {
    const maxIdDocument = await Book.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1);
    let nextId = maxIdDocument?.id ? maxIdDocument.id + 1 : 1;
    const bookData = new Book({
        id: Number(nextId),
        authors: req.body.authors,
        title: req.body.title,
        categories: req.body.categories,
        pageCount: req.body.pageCount,
        shortDescription: req.body.shortDescription,
        thumbnailUrl: req.body.thumbnailUrl
    });
    try {
        await bookData.save();
        let data = await Book.findOne({ id: nextId })
        res.send({ message: 'Book added successfully', data: data });
    } catch (err) {
        res.send({ message: 'Failed to add a Book', error: err });
    }
});


app.get('/getbooks', async (req, res) => {
    try {
        const books = await Book.find().sort({id:-1})
        res.json(books)
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
})

app.get('/getbooks/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const singleBook = await Book.findOne({ id: Number(id) });
        if (singleBook) {
            console.log(singleBook);
            res.send(singleBook);
        } else {
            res.status(404).send({ message: 'Book not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});


app.put('/updatebook/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const updatedBook = await Book.updateOne({ id: Number(id) }, { $set: req.body });

        if (updatedBook.modifiedCount === 0) {

            res.status(404).send({message:'Book not found'});
        } else {
            let data = await Book.findOne({ id: id })
            res.send({ message: 'Book updated successfully', data: data });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({message:'Internal Server Error'});
    }
});


app.delete('/removebook/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const del = await Book.deleteOne({ id: Number(id) });
        if (del.deletedCount === 0) {
            res.status(404).send({ message: 'Book not found' });
        } else {
            res.send({ message: 'Book deleted successfully' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});


const dburl = 'mongodb://localhost:27017/books'
// const dburl=`mongodb+srv://${process.env.MYUSERNAME}:${process.env.PASSWORD}@cluster0.yqebdfc.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(dburl).then(() => {
    console.log('Connection established');
})

app.listen(process.env.PORT, 'localhost', () => {
    console.log(`http://localhost:${process.env.PORT}`);
})
