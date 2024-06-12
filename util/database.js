// require('dotenv').config()
// const Sequelize = require('sequelize')

// const sequelize = new Sequelize('expenseuser', 'root', 'Afrin@786',{
//     dialect:'mysql',
//     host:'localhost'
// }) 


// module.exports = sequelize 

const mongoose = require('mongoose')

const createDB = async()=>{
    try{
     const conn = await mongoose.connect('mongodb+srv://afrinqureshifiza:Afrin123@expensetracker.apsz6he.mongodb.net/?retryWrites=true&w=majority&appName=expensetracker', {useNewUrlParser : true, })
    console.log(`connected databsse at ${conn.connection.host}`)   
    }
    catch(err){
        console.log(`Error ${err}`)
    }
}

module.exports = createDB