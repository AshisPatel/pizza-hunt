const { Pizza } = require("../models");

const pizzaController = {

    // get al pizzas
    getAllPizza(req, res) {
        Pizza.find({})
        // We are calling the populate method here to populate all the comment information in the comments key of the Pizza document.
        // Otherwise, all we get is the id. 
        // The '-' in the select removes the __v of the comments document
            .populate({
                path: 'comments',
                select: '-__v'
            })
            // This select '-' method allows us to ignore the __v section of the Pizza document
            .select('-__v')
            // This sort with the negative for id, will return our pizzas in descending order, meaning newest pizza first 
            .sort({ _id: -1 })
            .then(dbPizzaData => res.json(dbPizzaData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },
    // get pizza by id
    // req has been destructed to only grab the params object
    getPizzaById({ params }, res) {
        Pizza.findOne({ _id: params.id })
            .populate({
                path: 'comments',
                select: '-__v'
            })
            .select('-__v')
            .then(dbPizzaData => {
                dbPizzaData ?
                    res.json(dbPizzaData) :
                    res.status(404).json({ message: 'No Pizza found with this id!' });
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },
    // create Pizza post method
    // Once again req has been destructured, this time grabbing the body object 
    createPizza({ body }, res) {
        Pizza.create(body)
            .then(dbPizzaData => res.json(dbPizzaData))
            .catch(err => res.status(400).json(err));
    },
    // updated pizza by id
    updatePizza({ params, body }, res) {
        // The new: true parameter is to ensure that mongoose returns the new document rather than the old non-updated one 
        Pizza.findOneAndUpdate({ _id: params.id }, body, { new: true })
            .then(dbPizzaData => {
                dbPizzaData ?
                    res.json(dbPizzaData) :
                    res.status(404).json({ message: 'No pizza found with this id! ' });
            })
            .catch(err => res.status(400).json(err));
    },
    // Delete pizza
    deletePizza({ params }, res) {
        Pizza.findOneAndDelete({ _id: params.id })
            .then(dbPizzaData => {
                dbPizzaData ?
                    res.json(dbPizzaData) :
                    res.status(404).json({ message: 'No pizza found with this id!' })
            })
            .catch(err => res.status(400).json(err));
    }

    // Side note: the update and delete both have mongoose alternatives of xOne / xMany, but they do not return any data. 
};

module.exports = pizzaController;