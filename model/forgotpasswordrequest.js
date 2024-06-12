const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const forgotPasswordSchema = new Schema({

    uuid: {
        type: String,
        required: true
      },
    isActive: {
        type: Boolean,
        required: true,
        default: true
      },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
      }

})

module.exports = mongoose.model('ForgotPasswords', forgotPasswordSchema);


// const sequelize = require('../util/database')
// const Sequelize = require('sequelize')
// // const UUID = require('uuid')

// const Forgotpasswordrequest = sequelize.define('forgotpasswordrequest', {
//     id:{
//        type:Sequelize.UUID,
//        allowNull: false,
//        primaryKey: true 
//     },
//     isactive:Sequelize.BOOLEAN,

// })

// module.exports= Forgotpasswordrequest