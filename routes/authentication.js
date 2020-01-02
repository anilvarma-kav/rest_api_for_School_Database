const auth = require('basic-auth');
const bcryptjs = require("bcryptjs");
const {  models } = require('../db');
const { User } = models;
const authenticateUser = async (req, res, next) => {
    let message = null;

    // parse user's credentials from authorization header
    const credentials = auth(req);

    //if user credential's available
    if(credentials){

        // Attempt to retrieve user details from the database using username from Auth header
        const user = await User.findOne({
            where: {
                emailAddress: credentials.name
            }
        });

        //if user exists
        if(user){
            // Use bcryptjs to compare the user's password
            const authenticated = bcryptjs.compareSync(credentials.pass, user.password);

            //If password matches
            if(authenticated){
                console.log(`User : ${user.emailAddress} successfully authenticated`);

                //Store retrieved user object on the request object
                //So any middleware function that follow this middleware function
                //will have access to the user's information
                req.currentUser = user;
            }
            else {
                message = 'Acess Denied';
            }
        }
        else {
            message = `User not found: ${credentials.name}`;
        }
    }
    else{
        message = 'Auth header not found';
    }


    if(message){
        console.log(message);

        // Return a response with a 401 Unauthorized HTTP status code
        res.status(401).json({message: 'Access Denied'});
    } else {
        // call next() method if authentication succeeded

        next();
    }
};

module.exports = authenticateUser;
