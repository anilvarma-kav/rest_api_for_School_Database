'use strict';
//load required modules
var express = require('express');
var router = express.Router();
const {check, validationResult} = require('express-validator/check');
const {  models } = require('../db');
const { User, Course } = models;
const authenticateUser = require('./authentication');

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
// courses home route to get all the courses
router.get('/', asyncHandler(async (req, res) => {
    const courses = await Course.findAll({
        attributes: ["id", "title", "description", "userId", "estimatedTime", "materialsNeeded"],
        include: [
            {
                model: User,
                as: "user",
                attributes: ["id", "firstName", "lastName", "emailAddress"]
            }
        ]
    });

    res.json({
        courses
    });
}));

//courses route to get only one course with "id"
router.get('/:id', asyncHandler(async(req, res) => {
    const course = await Course.findByPk(req.params.id, {
        attributes: ["id", "title", "description", "userId", "estimatedTime", "materialsNeeded"],
        include: [
            {
                model: User,
                as: "user",
                attributes: ["id", "firstName", "lastName", "emailAddress"]
            }
        ]
    });
    if(course){
        res.json({
            course
        })
    }
    else {
        res.status(404).json({
            message: 'Course not found'
        });
    }
}));

// Route to create a new course
// This is an authenticated route
router.post('/',[
    check('title')
        .exists({ checkNull: true, checkFalsy: true}).withMessage('Please provide a value for "title"'),
    check('description')
        .exists({ checkNull: true, checkFalsy: true}).withMessage('Please provide a value for "description"'),

], authenticateUser,asyncHandler(async (req, res) => {

    // Attempts to get the validation results from the request object
    const errors = validationResult(req);

    // If there are validation errors....
    if(!errors.isEmpty()){
        // Array `map()` method to get a list of error messages
        const errorMessages = errors.array().map(error => error.msg);
        // return validation errors to the client
        res.status(400).json({ errors: errorMessages});
    }

    else{
        const course = req.body;

        const newCourse = await Course.create({
            title: course.title,
            description: course.description,
            userId: req.currentUser.id,
            estimatedTime: course.estimatedTime,
            materialsNeeded: course.materialsNeeded
        });

        const id = newCourse.id;

        res.location(`/courses/${id}`).status(201).end();
    }
}));

//Route to update the course
// This is an authenticated route

router.put('/:id', [
    check('title')
        .exists({ checkNull: true, checkFalsy: true}).withMessage('Please provide a value for "title"'),
    check('description')
        .exists({ checkNull: true, checkFalsy: true}).withMessage('Please provide a value for "description"'),

],authenticateUser,asyncHandler(async (req, res) => {

    // Attempts to get the validation results from the request object
    const errors = validationResult(req);

    // If there are validation errors....
    if(!errors.isEmpty()){
        // Array `map()` method to get a list of error messages
        const errorMessages = errors.array().map(error => error.msg);
        // return validation errors to the client
        res.status(400).json({ errors: errorMessages});
    }
    else{
        const course = await Course.findByPk(req.params.id);
        if(course){
            if(course.userId == req.currentUser.id){
                await Course.update({
                    title: req.body.title,
                    description: req.body.description,
                    estimatedTime: req.body.estimatedTime,
                    materialsNeeded: req.body.materialsNeeded
                }, {
                    where: {
                        id: course.id
                    }
                });
                res.status(204).end();
            }
            else {
                res.status(403).json({ message: "Access Denied" });
            }
        }
        else {
            res.status(404).json({ message: "Course not found." });
        }
    }

}));

// Route to delete(id) course with given "id"
// This is an authenticated route 
router.delete('/:id', authenticateUser, asyncHandler(async (req, res) => {

    const course = await Course.findByPk(req.params.id);
    if(course){
        if(course.userId == req.currentUser.id){
            await Course.destroy({
                where: {
                    id: course.id
                }
            });
            res.status(204).end();
        }
        else {
            res.status(403).json({ message: "Access Denied" });
        }
    }
    else {
        res.status(404).json({ message: "Course not found." });
    }
}));

module.exports = router;
