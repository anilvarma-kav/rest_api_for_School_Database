'use strict';
const Sequelize = require('sequelize');
// User Model
module.exports = (sequelize) => {
    class User extends Sequelize.Model {}
    User.init({
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        firstName: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        lastName: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        emailAddress: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    }, { sequelize });
    //Associate User model with Course model
    //which allows one user can create many courses
    User.associate = (models) => {
        User.hasMany(models.Course, {
            as: 'user',
            foreignKey: {
                fieldName: 'userId',
                allowNull: false
            }
        });
    };

    return User;
};
