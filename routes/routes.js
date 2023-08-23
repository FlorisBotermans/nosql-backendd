const UsersController = require('../controllers/users_controller');
const FriendshipsController = require('../controllers/friendships_controller');
const ThreadsController = require('../controllers/threads_controller');
const CommentsController = require('../controllers/comments_controller');

module.exports = (app) => {
    // USER CRUD
    app.post('/api/users', UsersController.createUser);
    app.put('/api/users', UsersController.editUser);
    app.delete('/api/users', UsersController.deleteUser);
    // FRIENDSHIP CRUD
    app.post('/api/friendships', FriendshipsController.createFriendship);
    app.delete('/api/friendships', FriendshipsController.deleteFriendship);

    // THREAD CRUD
    app.post('/api/threads', ThreadsController.createThread);
    app.post('/api/threads/:threadid/upvote', ThreadsController.upvoteThread);
    app.post('/api/threads/:threadid/downvote', ThreadsController.downvoteThread);
    app.get('/api/threads', ThreadsController.getAllThreads);
    app.get('/api/threads/:threadid', ThreadsController.getThreadById);
    app.put('/api/threads/:threadid', ThreadsController.editThread);
    app.delete('/api/users/:userid/threads/:threadid', ThreadsController.deleteThread);

    // COMMENT CRUD
    app.post('/api/threads/:threadid/comments', CommentsController.createComment);
    app.delete('/api/threads/:threadid/comments/:commentid', CommentsController.deleteComment);
};