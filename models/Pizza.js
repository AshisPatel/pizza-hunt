const { Schema, model } = require('mongoose');

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
        default: 'Large'
    },
    // Indicates an array as a datatype instead of using type: Array
    toppings: [],

    // We are telling this 'parent' model to expect an item of type Array, that is coming from another model (ObjectId) and also the name of the model
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
},
    {
        // this is set to enable the use of virtuals for our model
        toJSON: {
            virtuals: true
        },
        // This id is a virtual that is returned by mongoose that we do not need
        id: false
    }
);

// Get total number of comments and replies on retrieval
PizzaSchema.virtual('commentCount').get(function () {
    return this.comments.length;
});

const Pizza = model('Pizza', PizzaSchema);

module.exports = Pizza;