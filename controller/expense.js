const Expense = require('../model/expense');
const User = require('../model/user');
const path = require('path')
// const sequelize = require('../util/database')
const S3service = require('../services/s3services')
const Userservice = require('../services/userservices')
const fs = require('fs')


exports.addexpense = async(req,res)=>{
    // const t =await sequelize.transaction()
    console.log('requst user', req.user)
    const {amount, description, category}=req.body
    const userId = req.user.userId
    
    


    try{
      if(amount== undefined || amount.length==0 || description== undefined || description.length==0 ||category== undefined || category.length==0 ){
        return res.status(403).json({success:false, err:{message:'missing parameters'}})
      }

        const exp = await Expense.create({amount, description, category, userId:req.user._id})
        console.log('expense',exp)

        // const user =await User.findOne({where:{id:userId}})
        // console.log(user.totalExpenses)

        const totalExpenses=Number(amount)+Number(req.user.totalExpense)
        console.log('totalExpenses', totalExpenses)

        // await user.update({totalExpenses:totalExpenses},{transaction:t}) 
        await User.findByIdAndUpdate(req.user, {$set: {totalExpense : totalExpenses}})
       
        //    await t.commit()
           res.status(200).json({success:true, exp})  
  
    } 
    catch(err){
        // await t.rollback()
        console.log('error while creating record',err)
        res.status(403).json({success:false, err})
     }

} 

exports.deleteexpense=async(req,res)=>{
    // const t =await sequelize.transaction()
    try{
     console.log('user inside delete', req.user)
     console.log('req params inside delete', req.params.id)
     const userId = req.user.userId
     
     const expenseid = req.params.id
     const exp = await Expense.findByIdAndDelete(expenseid)
     const updateExpense = Number(req.user.totalExpense) - Number(exp.amount);
     await User.findByIdAndUpdate(req.user, { $set: { totalExpense: updateExpense } });
     return res.status(201).json({ message: 'success deletion' });
    
    
    //  if(!expenseid ||  expenseid.length === 0){
    //     // await t.rollback()
    //     return res.status(400).json({success:false, message:'id missing'})
    //  }

    //  const noOfRow= await expense.destroy({where:{id:expenseid, userId: req.user.userId}})
    //  if(noOfRow === 0){
    //     await t.rollback()
    //     return res.status(404).json({success:false, message:'data not found'})
    //  }
    //  const user =await User.findOne({where:{id:userId}})
    //  const amount=Number(user.totalExpenses)-Number(exp.amount)
     
    //  await user.update({totalExpenses:amount},{transaction:t})
    //  await t.commit()
    //  res.status(200).json({success:true, message:'Deleted Successfully'})
       
    }
    catch(err){
        console.error('Error while deleting expense:', err);
        // await t.rollback()
        res.status(500).json({success:false, err})
    }
}

exports.showexpense = async(req,res)=>{
    try{
        console.log('req inside showexpense', req.query)
    const page = Number(req.query.page) || 1 
    const ITEM_PER_PAGE = Number(req.headers.rowsperpage)
    console.log('rows',ITEM_PER_PAGE)
    const pageSize = Number(req.query.pageSize);
    console.log(req.user)
    
    const totalExpenses = await Expense.countDocuments({ userId: req.user })
    const expenses = await Expense.find({ userId: req.user }).skip((page - 1) * ITEM_PER_PAGE).limit(ITEM_PER_PAGE)

    return res.status(201).json({
        arr: expenses,
        currentPage: page,
        hasNextPage: totalExpenses - (page * ITEM_PER_PAGE) > 0,
        nextPage: page + 1,
        hasPreviousPage: page > 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalExpenses / ITEM_PER_PAGE),
        isPremium: req.user.isPremium
    });   
    }
    catch (err) {
        console.log(err);
    }

}

exports.showform = (req,res)=>{
    res.sendFile(path.join(__dirname,'../','views','expense.html'))
}

exports.downloadexpense=async(req,res)=>{
    try{
    
    const userId = req.user.userId
    
    console.log('download')
    const expenses =await Userservice.getExpenses(req)
    console.log(expenses)

    const stringifyExpenses = JSON.stringify(expenses)

    console.log('download')
    const filename = `Expenses${userId}/${new Date()}.txt`
    const fileURL =await S3service.uploadToS3(stringifyExpenses, filename)
    // console.log('fileurl', fileURL)
    // const filePath = path.join(__dirname,'../', 'filesDownloaded.txt')
    // fs.appendFile(filePath, fileURL, (err)=>{
    //     if (err) {
    //         console.error('Error creating file:', err);
    //         res.status(500).send('Error creating file.');
    //     } else {
    //         console.log('File created successfully.');
            
    //     } 
    // })
     res.status(200).json({fileURL, success:true}) 

    }
    catch(err){
        res.status(500).json({success:false, err})
    }
    
}


 