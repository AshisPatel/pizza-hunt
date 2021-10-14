const { Comment, Pizza } = require('../models');

const commentController = {
    // add comment to a specific pizza 
    addComment({ params, body }, res) {
        // Creating the comment in the comment document
        Comment.create(body)
            // the comment, then has an _id that mongo creates, we pass that on to the next function
            .then(({ _id }) => {
                return Pizza.findOneAndUpdate(
                    // This finds the right pizza based on the params.id that we pass in 
                    { _id: params.pizzaId },
                    // We are adding this specific comment's id to the comments array in the Pizza document 
                    // the $push method is adding data to the pre-existing array of comments in the Pizza document
                    // all Mongo-DB methods start with a '$' to distinguish them
                    // This comments section is also a 'subdocument' of the Pizza document
                    { $push: { comments: _id } },
                    { new: true }
                )
            })
            .then(dbPizzaData => {
                dbPizzaData ?
                    res.status(200).json(dbPizzaData) :
                    res.status(404).json({ message: 'No pizza found with this id!' })
            })
            .catch(err => res.status(500).json(err));
    },
    // add reply method to a comment document
    addReply({ params, body }, res) {
        Comment.findOneAndUpdate({ _id: params.commentId },
            { $push: { replies: body } },
            { new: true }
        )
            .then(dbPizzaData => {
                dbPizzaData ?
                    res.status(200).json(dbPizzaData) :
                    res.status(404).json({ message: 'No comment found with this id!' })
            })
            .catch(err => res.status(500).json(err));
    },
    // delete comment
    deleteComment({ params }, res) {
        // Find one and delete returns the object that is deleted, so we can pass it on in the next promise. 
        Comment.findOneAndDelete({ _id: params.commentId })
            .then(deletedComment => {

                if (!deletedComment) {
                    res.status(404).json({ message: "No comment found with this id!" })
                    return;
                }
                return Pizza.findOneAndUpdate(
                    { _id: params.pizzaId },
                    { $pull: { comments: params.commentId } },
                    { new: true }
                )
            })
            .then(dbPizzaData => {
                dbPizzaData ?
                    res.status(200).json(dbPizzaData) :
                    res.status(404).json({ message: 'No pizza found with this id!' });
            })
            .catch(err => res.status(500).json(err));
    },
    // Delete reply 
    deleteReply({ params }, res) {
        Comment.findOneAndUpdate(
            { _id: params.commentId },
            // Here we are tracking all of the reply data in replies, thus we need to destructure the reply object, and see where the replyId key matches the given id
            { $pull: { replies: { replyId: params.replyId} } },
            { new: true }
        )
        .then(dbPizzaData => {
            dbPizzaData ? 
                res.status(200).json(dbPizzaData) :
                res.status(404).json({ message: 'No pizza found with this id!' })
        })
        .catch(err => res.status(500).json(err));

    }
}

module.exports = commentController;