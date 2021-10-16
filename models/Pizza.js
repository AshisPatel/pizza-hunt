const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const PizzaSchema = new Schema({
    pizzaName: {
        type: String,
        required: 'A pizza name is required!',
        trim: true
    },
    createdBy: {
        type: String,
        required: true,
        trim: true 
    },
    createdAt: {
        type: Date,
        default: Date.now,
        // implementing a 'getter' by invoking the key word 'get'. A 'getter' is something that modifies the data in the db when it is being retrieved rather than editing the data during storage
        get: (createdAtVal) => dateFormat(createdAtVal)
    },
    size: {
        type: String,
        // A required string can't be returned here due to the enum, however there is a mongoose 'validate' function that can be utilized
        required: true,
        // enum sets the accepted values for this parameter 
        enum: ['Personal', 'Small', 'Medium', 'Large', 'Exta Large'],
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
        // this is set to enable the use of virtuals and getters for our model
        toJSON: {
            virtuals: true,
            getters: true
        },
        // This id is a virtual that is returned by mongoose that we do not need
        id: false
    }
);

// Get total number of comments and replies on retrieval
PizzaSchema.virtual('commentCount').get(function () {
    // The reduce method is like map, filter, forEach, etc. 
    // It iterates through the comments array of this object
    // Takes two arguements, the 'accumulator' (total in this case) and the current value of the array (comment in this case)
    // It is adding the number of replies of the current comment to the pre-existing accumulated total 
    // +1 is to account for the comment itself in the total count
    // The reduce varies from map because it uses the results from each execution for the next execution
    

    // Check to see if the "comment.replies" actually exists, otherwise the Insomnia for add a comment, will not be able to return the pizza data, since replies is nonexistant?
    return this.comments.reduce((total, comment) => {
        if (comment.replies) {
             return total + comment.replies.length + 1
        } else {
            return 1; 
        }
    }, 0);
});

const Pizza = model('Pizza', PizzaSchema);

module.exports = Pizza;