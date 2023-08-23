const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');

const User = mongoose.model('user');

describe('User controller', () => {
    it('POST to api/users creates a new user', done => {
            request(app)
                .post('/api/users')
                .send({ userName: 'testUser', password: 'testPassword' })
                .end((err, response) => {
                    assert(response.status === 200);
                    done();
                });    
    });

    it('PUT to api/users edits a user password', done => {
        const user =  new User({ userName: 'testUser', password: 'testCurrentPassword' })

        user.save().then(() => {
            request(app)
                .put('/api/users')
                .send({ userName: 'testUser', currentPassword: 'testCurrentPassword', newPassword: 'testChangedPassword' })
                .end(() => {
                    User.findOne({ userName: 'testUser' })
                        .then(user => {
                            assert(user.password === 'testChangedPassword');
                            done();
                        });
                });
        });
    });

    it('DELETE to api/users deletes a user ', done => {
        const user =  new User({ userName: 'testUser', password: 'testPassword' })

        user.save().then(() => {
            request(app)
                .delete('/api/users')
                .send({ userName: 'testUser', password:'testPassword' })
                .end((err,response) => {
                   assert(response.status === 200)
                   done();
                });
        });
    });
});