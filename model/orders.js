const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const orderSchema = new Schema({

    paymentid: {
        type: String
    },
    order_id: { type: String, unique: true },
    status: {
        type: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Reference to the User model
    }


})

module.exports = mongoose.model('Order', orderSchema);


// const sequelize = require('../util/database')
// const Sequelize = require('sequelize')

// const order = sequelize.define('order',{
//     id:{
//         type:Sequelize.INTEGER,
//         primaryKey:true,
//         allowNull:false,
//         autoIncrement:true
//     },

//     paymentId: Sequelize.STRING,
//     orderId: Sequelize.STRING,
//     status: Sequelize.STRING,
// })

// module.exports = order