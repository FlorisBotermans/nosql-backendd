const Thread = require('../models/thread');

module.exports = {
    createComment(req, res, next) {
        const embeddedComment = req.body;

        Thread.findById({ _id: req.params.threadid })
            .then(thread => {
                if(thread === null){
                    res.status(404).send({error : 'Thread does not exist'})
                }
                else{
                thread.comments.push(embeddedComment);
                return thread.save();
            }
            })
            .then(() => res.status(200).send(embeddedComment))
            .catch(next);
    },

    deleteComment(req, res, next) {
        Thread.findByIdAndDelete(
            { _id: req.params.threadid },
            { $pull: { comments: { _id: req.params.commentid } } } 
        )
        .then(thread => res.status(200).send(thread))
        .catch(next);
    }
};