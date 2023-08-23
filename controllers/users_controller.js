const User = require('../models/user');
const driver = require('../neo4jdriver');

module.exports = {
    createUser(req, res, next) {
        let session = driver.session();

        User.findOne({userName : req.body.userName})
        .then((user)=>{
            if(user !== null){
                res.send({Message: "Username is already taken"})
            }
        else{
        User.create(new User(req.body))
            .then((user) => res.send(user))
            .then(() => {
                session.run(
                    'CREATE (a:User { userName: $userName, password: $password }) RETURN a',
                    {
                        userName: req.body.userName,
                        password: req.body.password
                    }
                )
                session.close()
                res.status(200);
            })
        }
        })
            .catch(() => {
                session.close();
                next();
            });
    },

    editUser(req, res, next) {
        let session = driver.session();

        User.findOne({ userName: req.body.userName, password: req.body.currentPassword })
        .then((user) => {
            if(user === null) {
                res.status(401).send({ error: 'You entered a faulty password.' });
            } else {
                user.updateOne({ password: req.body.newPassword })
                    .then(() => user.save());
            }
        })
        .then(() => User.find({ userName: req.body.userName }))
        .then(user => res.send(user))
        .then(() => {
            session.run(
                'MATCH (n { userName: $userName, password: $currentPassword }) SET n.password = $newPassword RETURN n.userName, n.password',
                {
                    userName: req.body.userName,
                    currentPassword: req.body.currentPassword,
                    newPassword: req.body.newPassword
                }
            );
        })
        .catch(next);
    },

    deleteUser(req, res, next) {
        let session = driver.session();

        User.findOne({ userName: req.body.userName, password: req.body.password })
            .then((user) => {
                if(user === null) {
                    res.status(401).send({ error: 'You entered a faulty password.' });
                } else {
                    user.remove();
                    session.run(
                        'MATCH (a:User { userName: $userName, password: $password }) -[f:IS_FRIENDS_WITH]-() DELETE a, f',
                        {
                            userName: req.body.userName,
                            password: req.body.password
                        }
                    )
                    .then(() => session.close())
                    .then(() => res.status(200).send({Message: "User is deleted"}));
                }
            })
            .catch(() => {
                session.close();
                next();
            });
    }
};