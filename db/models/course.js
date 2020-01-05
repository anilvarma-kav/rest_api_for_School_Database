'use strict';
const Sequelize = require('sequelize');

//Course model
module.exports = (sequelize) => {
    class Course extends Sequelize.Model {}
    Course.init({
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        estimatedTime: {
            type: Sequelize.STRING,
        },
        materialsNeeded: {
            type: Sequelize.STRING,
        }
    }, { sequelize });

    //Associaet Course Model with User model
    //Which makes each Course bolongs to only one User
    Course.associate = (models) => {
        Course.belongsTo(models.User, {
            as: 'user',
            foreignKey: {
                fieldName: 'userId',
                allowNull: false
            }
        });
    };


    return Course;
};
