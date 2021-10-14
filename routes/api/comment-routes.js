const router = require('express').Router();
const {
    addComment,
    deleteComment,
    addReply,
    deleteReply
} = require('../../controllers/comment-controller');

router.route('/:pizzaId').post(addComment);

router
    .route('/:pizzaId/:commentId')
    // Even though we are creating a "reply" we are updating a comment to add the reply... so it's a put request 
    .put(addReply)
    .delete(deleteComment);

router
    .route('/:pizzaId/:commentId/:replyId')
    .delete(deleteReply)
module.exports = router;