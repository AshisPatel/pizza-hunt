const { Pizza } =require("../models");

const pizzaController = {

    // get al pizzas
    getAllPizza(req, res) {
        Pizza.find({})
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