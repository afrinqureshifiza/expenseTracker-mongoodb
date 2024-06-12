const User= require('../model/user')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const sib = require('sib-api-v3-sdk')
const Forgotpasswordrequest = require('../model/forgotpasswordrequest')


exports.retrivepassword=async (req,res)=>{
  try{
    // alert('check your mail')
    console.log('req->',req.body.email)
    const Email = req.body.email
    const user = await User.findOne({email:Email})
    console.log(user)
    if (!user) {
      res.status(401).json({ success: false, message: "User not found" });
    }
    if(user){

      const newid = uuid.v4()
      await Forgotpasswordrequest.create({uuid:newid,isActive:true, userId:user.id}) 
      .catch(err=> console.log('error while adding forgot pwd record', err))

      const client = sib.ApiClient.instance
      
      const apikey = client.authentications['api-key']
      apikey.apiKey = process.env.RESETPWD_API_KEY

      const transEmailApi = new sib.TransactionalEmailsApi()

      const sender={
        email:'fizaafrinqureshi@gmail.com',
        name:'Afrin'
      }

      const reciever=[
        {
            email:Email
        }
      ]

      transEmailApi.sendTransacEmail({
        sender,
        to:reciever,
        subject:'Reset Password Email !!!',
        htmlContent:`<h4>This is an email to reset your password ,click on the link below to reset</h4>
        <a href='http://localhost:3000/password/resetpassword/${newid}'>click here</a>`
      })
      .then((msg)=>{
        console.log(msg)
        res.status(200).json({message:'link sent to your email'})
      })
      .catch(err=>{
        throw new Error(err)
        console.log('Something went wrong')
      })
    }
    else{
        throw new Error('User donot exist')
    }
  }
  catch(err){
     res.status(401).json({message:err})
  }
    
}

exports.resetPassword=async(req,res)=>{
   try{
    const id = req.params.id 
   const fp = await Forgotpasswordrequest.findOne({uuid:id, isActive:true})
   console.log('fp',fp)
   if(fp){
    // fp.findOneAndUpdate({$set : {isactive:false}})
    fp.isActive = false
    fp.save()
    res.status(200).send(
        `<html>
         <form action='/password/updatepassword/${fp.userId}' method='get'>
           <label>Enter new password:
           <input type='password' name='newpassword' required>
           </label>
           <button>Reset Password</button>
         </form>
        </html>`
    )
   }
   }
   catch(err){
    res.status(401).json({message:err})
   }
}

exports.updatepassword=async(req,res)=>{
   try{
    const {newpassword} = req.query
    console.log('new=',newpassword)
    const userId = req.params.userId
    console.log('query=',userId)
        // const fp = await forgotPassword.findOne({ uuid: uuidd, isActive: true })

        // const userId = fp.userId;

        // const user = await User.findOne({ _id: userId })

        // await forgotPassword.findOneAndUpdate({ uuidd }, { isActive: false });

        // const hash = await bcrypt.hash(password, 10);

        // await User.updateOne({ _id: userId }, { password: hash });

        // res.status(200).json({ message: 'Your password is successfully changed' })

   
   const user = await User.findOne({_id:userId})
   console.log(user)
   if(user){
    bcrypt.genSalt(10,(err, salt)=>{
        if(err){
            throw new Error(err)
        }

        bcrypt.hash(newpassword, salt, async(err,hash)=>{
            if(err){
                throw new Error(err)
            } 
           user.password = hash
           user.save()
           console.log('updated successfully')
           res.status(200).send(`
           <html>
           <p>Password updated successfully</p>
           <button onclick=(clickHandler())>Back to Login</button>
           </html>
           <script>
           function clickHandler(){
            window.location.href = '../../user/show-loginform';}
           </script>`)
        })
    })
   }
   else{
    throw new Error('User do not exist')
   }
   }
   catch(err){
    console.log(err)
    res.status(500).json(err)
   }
}