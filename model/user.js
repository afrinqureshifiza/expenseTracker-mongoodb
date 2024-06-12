const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    // _id: { type: mongoose.Schema.Types.ObjectId, required: true, auto: true },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isPremium: {
        type: Boolean,
        default: false
    },
    totalExpense: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model('User', userSchema)

// const Sequelize = require('sequelize')
// const sequelize = require('../util/database')

// const user = sequelize.define('user', {
//     id:{
//         type:Sequelize.INTEGER,
//         primaryKey:true,
//         allowNull:false,
//         autoIncrement:true
//     },

//     name:Sequelize.STRING,

//     email:{
//         type:Sequelize.STRING,
//         unique:true,
//         allowNull:false
//     },

//     password:{
//         type:Sequelize.STRING
//     },
//     totalExpenses:Sequelize.INTEGER,
//     isPremium:Sequelize.BOOLEAN
// })
 
// module.exports = user