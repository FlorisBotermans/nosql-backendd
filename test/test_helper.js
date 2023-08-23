const mongoose = require('mongoose');

before(done => {
    mongoose.connect('mongodb://admin:Secret123@ds032887.mlab.com:32887/studdit_test', { useNewUrlParser: true });
    mongoose.connection
        .once('open', () => done())
        .on('error', err => {
            console.warn('Warning', error);
        });
});

beforeEach(done => {
    const { users, threads } = mongoose.connection.collections;
    users.drop(() => {
        threads.drop(() => {
            done();
        });
    });
});