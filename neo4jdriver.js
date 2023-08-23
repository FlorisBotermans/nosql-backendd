const neo4j = require('neo4j-driver').v1;

let driver;

driver = neo4j.driver('bolt://hobby-jnapnogldadkgbkeoblmmacl.dbs.graphenedb.com:24787',
    neo4j.auth.basic('NoSql', 'b.FfEkbjilshnH.iWOCuQ7gfpYR9yc5'));

module.exports = driver;