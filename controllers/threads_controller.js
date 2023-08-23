const User = require('../models/user');
const Thread = require('../models/thread');
const mongoose = require('mongoose');

module.exports = {
    createThread(req, res, next) {
        const thread = new Thread({userName: req.body.userName,title: req.body.title, content: req.body.content});

        Thread.create(thread)
            .then(() => User.findOne({ userName: req.body.userName }))
            .then(user => {
                user.threads.push(thread._id);
                return user.save();
            })
            .then(() => res.send(thread))
            .catch(next);
    },

    getAllThreads(req, res, next) {
        const threadList = [];
        Thread.find({})
            .then(threads => {
                threads.forEach(thread=>{
                    items = {
                    _id: thread._id,
                    title: thread.title,
                    userName: thread.userName,
                    content: thread.content,
                    upVote: thread.upVote,
                    downVote: thread.downVote                 
                    }
                    threadList.push(items);

                })
                res.status(200).send(threadList);
            })
            .catch(next);
    },

    getThreadById(req, res, next) {
        Thread.findById({ _id: req.params.threadid })
            .then(thread => {
                if(thread === null){
                    res.status(404).send({ Error: 'Thread does not exist'});
                }
                else{
                    items ={
                        _id: thread._id,
                    title: thread.title,
                    userName: thread.userName,
                    content: thread.content,
                    upVote: thread.upVote,
                    downVote: thread.downVote,
                    comments: thread.comments 
                    };
                    res.status(200).send(items);
                }
            })
            .catch(next);
    },

    editThread(req, res, next) {
        if(req.body.content != null) {
            Thread.findByIdAndUpdate(
                { _id: req.params.threadid },
                { $set: { content: req.body.content } }
            )
            .then(() => Thread.findById({ _id: req.params.threadid }))
            .then(thread => res.send(thread))
            .catch(next);
        } else {
            res.status(422).send({ error: 'Only the content can be modified.' });
        }
    },

    deleteThread(req, res, next) {
        User.findByIdAndUpdate(
            { _id: req.params.userid },
            { $pull: { threads: req.params.threadid } } 
        )
        .then(() => Thread.findByIdAndDelete({ _id: req.params.threadid }))
        .then(thread => res.status(200).send(thread))
        .catch(next);
    },

    upvoteThread(req, res, next){
        Thread.findById({ _id: req.params.threadid } )
            .then((thread) => {
                if(thread !== null) {
                    User.findOne({ userName: req.body.userName })
                            .then((user) => {
                                if(user !== null ) {
                                    Thread.find({upVote: req.body.userName})
                                    .then((threadss)=> {
                                        if(threadss !== null){
                                            thread.upVote.push(req.body.userName);
                                            return thread.save()
                                            .then((thread) => {
                                                res.status(200).send(thread);
                                            })
                                        }
                                    }).catch(next);
                                }
                                 else{
                                    res.send({error: 'User does not exist'})
                                }
                            }).catch(next);  
                        }                
                        else{
                            res.status(422).send({error: 'Thread does not exist'})
                        }     
                }).catch(next);
            },

    downvoteThread(req, res, next){
        User.findOne({ userName: req.body.userName })
            .then((user) => {
                if(user !== null) {
                    Thread.findById({ _id: req.params.threadid } )
                        .then((thread) => {
                            if(thread !== null) {
                                thread.downVote.push(req.body.userName);
                                return thread.save()
                                .then((thread) => {
                                    res.status(200).send(thread);
                                })
                                .catch(next);
                                }
                            else{
                                res.send({error: 'User does not exist'})
                                }
                            }).catch(next);  
                        }                
                    else{
                        res.status(422).send({error: 'Thread does not exist'})
                        }     
                }).catch(next);
            }
        };