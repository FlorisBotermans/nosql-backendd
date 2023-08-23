const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');

const User = mongoose.model('user');
const Thread = mongoose.model('thread');

describe('Thread controller', () => {
    it('POST to api/threads creates a new thread', done => {
        Thread.countDocuments().then(count => {
            request(app)
                .post('/api/threads')
                .send({ userName: 'testUserName', title: 'testTitle', content: 'testContent' })
                .end(() => {
                    Thread.countDocuments().then(newCount => {
                        assert(count + 1 === newCount);
                        done();
                    });
                });
        });
    });

    it('GET to api/threads retrieves all threads', done => {
        const thread = new Thread({ userName: 'testUserName',title: 'testTitle', content: 'testContent' });
        const thread2 = new Thread({ userName: 'testUserName2',title: 'testTitle2', content: 'testContent2' });

        Promise.all([thread.save(), thread2.save()])
            .then(() => {
                request(app)
                    .get('/api/threads')
                    .end((err, response) => {
                        assert(response.body.length === 2);
                        done();
                    });
            });
    });

    it('GET to api/threads/threadid retrieves a specific thread', done => {
        const thread = new Thread({userName: 'testUserName', title: 'testTitle', content: 'testContent' });

        thread.save()
            .then(() => {
                request(app)
                    .get('/api/threads/' + thread._id)
                    .end((err, response) => {
                        assert(response.body.title === 'testTitle');
                        done();
                    });
            });
    });

    it('PUT to api/threads/threadid edits the content of a thread', done => {
        const thread = new Thread({userName: 'testUserName', title: 'testTitle', content: 'testContent' });

        thread.save().then(() => {
            request(app)
                .put('/api/threads/' + thread._id)
                .send({ content: 'changedContent' })
                .end(() => {
                    Thread.findOne({ title: 'testTitle' })
                        .then(thread => {
                            assert(thread.content === 'changedContent');
                            done();
                        });
                });
        });
    });

    it('DELETE to api/users/userid/threads/threadid deletes a thread', done => {
        const user = new User({ userName: 'testUserName', password: 'testPassword' });
        const thread = new Thread({userName: 'testUserName', title: 'testTitle', content: 'testContent' });

        Promise.all([user.save(), thread.save()]).then(() => {
            request(app)
                .delete('/api/users/' + user._id + '/threads/' + thread._id)
                .end(() => {
                    Thread.findOne({ title: 'testTitle' })
                        .then(thread => {
                            assert(thread === null);
                            done();
                        });
                });
        });
    });

    it('POST to api/threads/threadid will upvote the thread', done =>{
        const user = new User({ userName: 'testUserName', password: 'testPassword' });
        const thread = new Thread({ userName: 'testUserName', title: 'testTitle', content: 'testContent' });

        Promise.all([thread.save(), user.save()]).then(()=>{
            request(app)
            .post('/api/threads/'+ thread._id + "/upvote")
            .send({ userName: 'testUserName', password: 'testPassword'})
            .end((err, response)=>{
                assert(response.status === 200)
                done();
            })
        })
    });

    it('POST to api/threads/threadid will downvote the thread', done =>{
        const user = new User({ userName: 'testUserName', password: 'testPassword' });
        const thread = new Thread({ userName: 'testUserName', title: 'testTitle', content: 'testContent' });

        Promise.all([thread.save(), user.save()]).then(()=>{
            request(app)
            .post('/api/threads/'+ thread._id + "/downvote")
            .send({ userName: 'testUserName', password: 'testPassword'})
            .end((err, response)=>{
                assert(response.status === 200)
                done();
            })
        })
    });

});