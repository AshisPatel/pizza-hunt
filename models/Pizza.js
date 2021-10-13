import { Schema, Model } from 'mongoose';


const PizzaSchema = new Schema({
    pizzaName: {
        type: String
    },
    createdBy: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    size: {
        type: String,
        default:'Large'
    },
    // Indicates an array as a datatype instead of using type: Array
    toppings: []
});

const Pizza = model('Pizza', PizzaSchema);

export default Pizza; 