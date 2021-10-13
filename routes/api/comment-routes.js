const router = require('express').Router();
const { addComment, deleteComment } = require('../../controllers/comment-controller');

router.route('/:pizzaId').post(addComment);

router.route('/:pizzaId/:commentId').delete(deleteComment);

module.exports = router; 