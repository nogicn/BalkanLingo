const userModel = require('../models/user_model');
const db = require('./database');
const axios = require('axios');

function postUserAxios(name, surname, email, password) {
    axios.post('http://localhost:3000/user/register', {
        name: name,
        surname: surname,
        email: email,
        password: password
    })
    .then(function (response) {
        //console.log(response);
    })
    .catch(function (error) {
        console.log(error);
    });
}


function migration(){
    db.prepare(userModel.createUserTable).run();

    postUserAxios("Admin", "Admin", "admin@gmail.com", "admin");
    postUserAxios("User", "User", "user@gmail.com", "user");

    console.log("Migration complete")
}


exports.migration = migration;
