const Razorpay = require('razorpay')
const Order = require('../model/orders')
const User= require('../model/user')
const userController = require('../controller/user')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

exports.purchasepremium = async(req, res)=>{
    try{
      console.log('premium', req.user)
      const userId = req.user._id
      let rzp=new Razorpay({              
        key_id : process.env.RAZORPAY_KEY_ID,
        key_secret : process.env.RAZORPAY_KEY_SECRET
      })
       console.log('a') 
      const amount = 2500
      
      rzp.orders.create({amount, currency:'INR'}, (err, order)=>{
        console.log(`order`, order)
        console.log(`orderid ${order.id}`)
        if(err){
            throw new Error(err)
            // JSON.stringify(err)
        }
        Order.create({order_id: order.id, status:'PENDING', userId: userId, paymentid:null})
        .then(()=>{
            res.status(200).json({order, key_id: rzp.key_id})
        })
        .catch(err=>{
            console.log(err)
            throw new Error(err)
        })
      })

    }
    catch(err){
       res.status(500).json({message:'Something went wrong'})
    }
}

const generateToken=(id, name, ispremium)=>{
  const secret_key='jkhdsc08wyed9u473t28y308y036033w9u09797wy387te28g33w'
  return jwt.sign({userId:id, username:name, isPremium:ispremium}, process.env.secret_key)
}

exports.updateTransactionStatus = async (req, res) => {
  const { payment_id, order_id } = req.body;

  if (!req.body.suc) {
      try {
        console.log('req', req.user)
        console.log('odrid', order_id)
          const order = await Order.findOne({ order_id: order_id });
          // const user = await User.findById(req.user.userId);
          const user = await User.findOne({email:req.user.email})

          console.log('user', user)
          order.paymentid = payment_id;
          order.status = 'SUCCESSFUL';

          user.isPremium = true;

          await Promise.all([order.save(), user.save()]);
          res.status(202).json({ success: true, message: 'Transaction Successful' });
      } catch (err) {
          console.log(err);
          res.status(500).json({ error: err, message: 'Something went wrong' });
      }
  } else {
      try {
          const order = await Order.findOne({ order_id: order_id });
          const user = await User.findOne({email:req.user.email})

          order.paymentid = payment_id;
          order.status = 'FAILED';

          user.isPremium = false;

          await Promise.all([order.save(), user.save()]);
          res.status(202).json({ success: true, message: 'Transaction Unsuccessful' });
      } catch (err) {
          console.log(err);
          res.status(500).json({ success: false, message: 'Error occurred while updating' });
      }
  }
}

// exports.updateTransactionStatus = async(req, res)=>{
//     // try{
//       console.log('req body', req.body)
//       const userId = req.user._id
//       const {order_id, payment_id}= req.body
//       try {
//         if (!mongoose.Types.ObjectId.isValid(order_id)) {
//           console.log('invalid orderid')
//           return res.status(400).json({ success: false, message: 'Invalid order_id' });
//         }
//         const objectId = new mongoose.Types.ObjectId(order_id);
//         console.log(objectId) 
//         const order = await Order.findOne({ order_id: order_id });
//         console.log('object', order)
//     if (!order) {
//       return res.status(404).json({ success: false, message: 'Order not found' });
//     }

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }

//     order.paymentid = payment_id || null;
//     order.status = 'SUCCESSFUL';
//     user.isPremium = true;

//         await Promise.all([order.save(), user.save()]);
//         res.status(202).json({ success: true, message: 'Transaction Successful' });
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ error: err, message: 'Something went wrong' });
//     }
//     //   console.log('user',req.user)
//     //   console.log('userid',req.userID.userId)
//     //   // const decodedToken= req.header('decoded')
//     //   // decodedToken.isPremium=false

//     //   const order = await Order.findOne({ order_id: order_id });
//     //   // const promise1= order.update({paymentId:payment_id, status:'Success'})
//     //   const objectId = new mongoose.Types.ObjectId(userId);
//     //   // Find the user by the ObjectId
//     //   const user = await User.findOne({ userId: objectId });
  
//     //   // const promise2= user.update({isPremium:true}) 
//     //   order.paymentid = payment_id;
//     //   order.status = 'SUCCESSFUL'
      
//     //   await Promise.all([order.save(), user.save()]).then(()=>{
//     //     res.status(202).json({success:true, message:'Transaction Successful', token: generateToken(userId, undefined, true)})
//     //   })
//     // }
//     // catch(err){
//     //   this.updatefailedTransactionStatus(req)
//     //   // console.error('Transaction failed:', err);
//     //   // res.status(500).json({ success: false, message: 'Transaction failed' });   
//     // }
// }

// exports.updatefailedTransactionStatus=async(req,res)=>{
//   const { payment_id, order_id } = req.body;
//   const userId = req.user._id
//   console.log(userId)
//   try {
//     const order = await Order.findOne({ orderid: order_id });
//     const user = await User.findById(req.user.userId);

//     order.paymentid = payment_id;
//     order.status = 'FAILED';

//     user.isPremium = false;

//     await Promise.all([order.save(), user.save()]);
//     res.status(202).json({ success: true, message: 'Transaction Unsuccessful' });
// } catch (err) {
//     console.log(err);
//     res.status(500).json({ success: false, message: 'Error occurred while updating' });
// }
//   // const order = await Order.findOne({ order_id: order_id });
//   // const user = await User.findById({userId})
//   //   // const order= await Order.findOne({where:{orderId: order_id}})
//   //   // const promise1= order.update({paymentId:'fail', status:'Failed'})
//   //   // const u = await user.findOne({where:{id: userId}})
//   //   // const promise2= u.update({isPremium:false}) 
      
//   //   order.paymentid = payment_id;
//   //   order.status = 'FAILED';

//   //   await Promise.all([order.save(), user.save()]).then(()=>{
//   //     res.status(202).json({success:true, message:'faliure of payment'})
//   //   })
//   //   .catch((err)=>{
//   //   res.status(500).json({ success: false, message: 'fail updation failed' });    
//   //   })
// }