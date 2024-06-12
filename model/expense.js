const mongoose = require('mongoose')

const expenseSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    } 
})

module.exports = mongoose.model('Expense', expenseSchema)

// const Sequelize = require('sequelize')
// const sequelize = require('../util/database')

// const expense = sequelize.define('expense',{
//     id:{
//         type:Sequelize.INTEGER,
//         primaryKey:true,
//         allowNull:false,
//         autoIncrement:true
//     },

//     amount:Sequelize.INTEGER,

//     description:Sequelize.STRING,

//     category:Sequelize.STRING
// })

// module.exports = expense

