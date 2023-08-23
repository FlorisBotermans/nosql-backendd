const driver = require('../neo4jdriver');
const User = require('../models/user')

module.exports = {
    createFriendship(req, res, next) {
        

        let session = driver.session();

        session.run(
            'MATCH (a:User),(b:User) WHERE a.userName = $userName1 AND b.userName = $userName2 CREATE UNIQUE (a)<-[r:IS_FRIENDS_WITH]- (b) CREATE UNIQUE (a)- [s:IS_FRIENDS_WITH]->(b)',
            {
                userName1: req.body.userName1,
                userName2: req.body.userName2
            }
        )
        .then(() => res.status(200).send({Message : req.body.userName1 + ' is friends with '+ req.body.userName2}))
        .catch(() => {
            res.status(422).send();
            session.close();
            next();
        });
        
 
    },
    
    deleteFriendship(req, res, next) {
        let session = driver.session();

        session.run(
            'MATCH (:User {userName: $userName1})-[r:IS_FRIENDS_WITH]-(:User {userName: $userName2}) DETACH DELETE r',
            {
                userName1: req.body.userName1,
                userName2: req.body.userName2
            }
        )
        .then(() => res.status(200).send({Message : req.body.userName1 + ' ended friendship with '+ req.body.userName2}))
        .catch(() => {
            res.status(422).send();
            next();
        });
    }
};