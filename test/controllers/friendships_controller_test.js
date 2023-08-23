const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const User = require('../../models/user');

describe('Friendship controller', () => {

    it('POST to api/friendships creates a new friendship', (done) => {
        const user1 = new User({ userName: 'testUserName', password: 'testPassword' });
        const user2 = new User({ userName: 'NogEenTestUser', password: 'testPassword' });

        user1.save().then(()=> {
             user2.save().then(()=>{ 
                 request(app)
                 .post('/api/friendships')
                 .send({ userName1: 'testUserName', userName2: 'NogEenTestUser'})
                 .end((err,response) => {
                    assert(response.status === 200)
                    done();                 
                })
                
            })
        })
        
    }),
     
    it('DELETE to api/friendships deletes a friendship', (done) => {
        const user1 = new User({ userName: 'testUserName', password: 'testPassword' });
        const user2 = new User({ userName: 'NogEenTestUser', password: 'testPassword' });
         
        user1.save().then(()=> {
             user2.save().then(()=>{ 
                 request(app)
                 .post('/api/friendships')
                 .send({ userName1: 'testUserName', userName2: 'NogEenTestUser'})
                 .end((err,response) => {
                     request(app)
                     .delete('/api/friendships')
                     .send({ userName1: 'testUserName', userName2: 'NogEenTestUser'})
                     .end((err, response)=> {
                        assert(response.status === 200);
                        done();
                    })
                })
            })
        })
        
    })
});