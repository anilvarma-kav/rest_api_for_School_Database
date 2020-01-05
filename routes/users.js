var express = require('express');
var router = express.Router();
const {check, validationResult} = require('express-validator/check');
const bcryptjs = require('bcryptjs');
const authenticateUser = require('./authentication');
const {  models } = require('../db');
const { User } = models;


// Helper function so that we don't need to add try/catch to every route
function asyncHandler(cb) {
    return async (req, res, next) => {
        try {
            await cb(req, res, next);
        } catch (err) {
            next(err);
        }
    };
}

// User Home route
// authenticated route
router.get('/', authenticateUser,(req, res) => {
    const {id, firstName, lastName, emailAddress} = req.currentUser;
    res.json({
        id,
        firstName,
        lastName,
        emailAddress,
    });
});

// Create new user route
router.post('/', [
    check('firstName')
        .exists({ checkNull: true, checkFalsy: true}).withMessage('Please provide a value for "first name"'),
    check('lastName')
        .exists({ checkNull: true, checkFalsy: true}).withMessage('Please provide a value for "last name"'),
    check('emailAddress')
        .exists({ checkNull: true, checkFalsy: true}).withMessage('Please provide a value for "email"')
        .isEmail().withMessage('Please provide valid email address for "email"'),
    check('password')
        .exists().withMessage('Please provide a value for "password"')
        .isLength({min: 8,max: 30}).withMessage('Please provide a value for "password" that is between 8 and 30 characters in length '),
],asyncHandler(async(req, res) => {
    // Attempts to get the validation results from the request object
    const errors = validationResult(req);

    // If there are validation errors....
    if(!errors.isEmpty()){
        // Array `map()` method to get a list of error messages
        const errorMessages = errors.array().map(error => error.msg);
        // return validation errors to the client
        return res.status(400).json({ errors: errorMessages});
    }
    // Get the users form the request body
    const user = req.body;
    //Check if user already Exists
    const userexists = await User.findOne({
        where: {
            emailAddress : user.emailAddress
        }
    });

    //Create a user only if user not exists
    if(!userexists){
        // Hash the new user's password
        user.password = bcryptjs.hashSync(user.password);
        //Create user
        await User.create({
            firstName: user.firstName,
            lastName: user.lastName,
            emailAddress: user.emailAddress,
            password: user.password
        });
        // Set the status to 201 Created and end the response
        return res.location('/').status(201).end();
    }else {
        res.status(400).json({message: "Email address already exists. Please use different email address"});
    }


}));
module.exports = router;
