const knex = require('knex');
const config = require('./../../knexfile');
const db = knex(config.development);
const bcrypt = require('bcryptjs');


module.exports = {
    findUserById,
    findUserByName,
    addUser,
}
async function addUser (userData){
    console.log('hi');
    let result = false;
    try {
        result = await db('users').insert({
            username: userData.username,
            password : bcrypt.hashSync(userData.password, 14)
        });
    }
    catch(e) {
        console.log(e);
        return false;
    }
    return result;
}

function findUserById(id) {
    return db('users').where('id',id).first();
}
function findUserByName(str) {
    return db('users').where('username',str).first();
}
