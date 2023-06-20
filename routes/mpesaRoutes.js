const express = require('express')
const router = express.Router()
require('dotenv').config()
const axios = require('axios')

// token generation middleware
const generateToken = async ( req,res,next)=>{
    const secret = process.env.mpesa_consumer_secret;
    const consumer = process.env.mpesa_consumer_key;
    const auth =new Buffer.from(`${consumer}:${secret}`).toString("base64")
    await axios.get("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    {
        headers:{
            authorization : `Basic ${auth}`
        }

    }
    ).then((response)=>{
        token = response.data.access_token;
        console.log(token)
        next();
    }).catch((err)=>{
        console.log(err)
        // res.status(400).json(err.message)
        
    })
}


router.post('/send',generateToken, async (req,res)=>{
    const phone = req.body.phone
    const amount = req.body.amount; 
    const date = new Date();
    const timestamp =   
        date.getFullYear()+
        ("0"+(date.getMonth()+1)).slice(-2)+
        ("0"+date.getDate()).slice(-2)+
        ("0"+date.getHours()).slice(-2)+
        ("0"+date.getMinutes()).slice(-2)+
        ("0"+date.getSeconds()).slice(-2);
        
    const shortcode = process.env.mpesa_paybill;
    const passkey = process.env.mpesa_passkey;
    const password = new Buffer.from(shortcode + passkey + timestamp).toString("base64")
    console.log(phone+','+amount) 
    await axios.post(
    "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
    {    

        "BusinessShortCode": shortcode,    
        "Password": password,    
        "Timestamp":timestamp,    
        "TransactionType": "CustomerBuyGoodsOnline",    
        "Amount": amount,    
        "PartyA":phone,    
        "PartyB":shortcode,    
        "PhoneNumber":phone,    
        "CallBackURL": "https://mydomain.com/pat",    
        "AccountReference":phone,    
        "TransactionDesc":"Test"
     },
     {
        headers:{
            
            'Authorization':`Bearer ${token}`
        }
     }

    ).then((result)=>{
        console.log(result.data)
        res.send((result.data))
        res.render('admin',{title:'admin portal'})
    }).catch((err)=>{
        console.log(err)
        
    })


})

// SALARY PAYMENT 

router.post('/salary',generateToken ,async (req,res)=>{
    await axios.post(
        "https://sandbox.safaricom.co.ke/mpesa/b2c/v1/paymentrequest",
        {
            
                "InitiatorName": "testapi",
                "SecurityCredential": "hoB4ob+KXzhkejzTeqAmEOuf+at2J4Cc8Il613AETKGeusIEJgNP4h51/gu3wQGPjRCjAhJEhwlSoBKlTrkIOtUqfGh4yK+mazDVYDc+5TbHIg5t/DMZdnRzVZYmI9qySDnyBXlsi0dxbofEkwpf3v5pjvwuPhxxIn+uUxnjDnJymyUHCGDoW+28Qs9NkvNS9VJk4mN8aj4jMjsQ681mtBDv7XV6NtV4BtzlFf4Lvr9YZ52McpcW7h+EKXJqbSL7wJeVkloM1qjeazu9npF44TwEeNDJoYKd07hyIgQQwvSBd1VW2CyGMZaEK1oVv6E4E98Oni0XFFOO5rx2NZ565A==",
                "CommandID": "SalaryPayment",
                "Amount": "1",
                "PartyA": "600977",
                "PartyB": "254110517055",
                "Remarks": "Test remarks",
                "QueueTimeOutURL": "https://mydomain.com/b2c/queue",
                "ResultURL": "https://mydomain.com/b2c/result",
                "Occassion": "",
              
        },{
        headers:
        {
            'Content-Type': 'application/json',
	        'Authorization': `Bearer ${token}`
        }}
    )

})


module.exports= router;