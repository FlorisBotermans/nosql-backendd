const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');

const Thread = mongoose.model('thread');
const Comment = mongoose.model('comment')

describe('Comments controller', () => {
    it('POST to api/comments creates a new comment subdocument', done => {
        const thread = new Thread({
            userName: 'testUserName',
            title: 'testTitle',
            content: 'testContent',
            comments: [{ content: 'testContent2', userName: 'testuser' }]
        });
        

        thread.save()
            .then(() => {
                request(app)
                    .post('/api/threads/' + thread._id + '/comments')
                    .send({ content: 'testContent3', userName: 'testuser' })
                    .end((err, response) => {
                        assert(response.body.content === 'testContent3',);
                        done();
                    });
            });
    });

    it('DELETE to api/comments deleted a comment subdocument', done => {
        const thread = new Thread({
            userName: 'testUserName',
            title: 'testTitle',
            content: 'testContent',
            comments: [{ content: 'testContent2', userName: 'testuser' }]
        });
        const comment = new Comment({content : 'content', userName: 'testuser'})

        thread.save()
            .then(() => {
                request(app)
                    .post('/api/threads/' + thread._id + '/comments')
                    .send(comment)
                    .end((err, response) => {
                        request(app)
                        .delete('/api/threads/' + thread._id + '/comments/' + comment._id)
                        .end((err, response)=>{
                            assert(response.status === 200)
                            done();
                        })                   
                    });
            });
    });
});