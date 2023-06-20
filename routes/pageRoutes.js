const express = require('express')
const router = express.Router()

router.get('/',(req,res)=>{
    res.render('index',{title:'home'})
})

router.get('/portal',(req,res)=>{
    res.render('login',{title:'login'})
})
router.get('/admin-portal',(req,res)=>{
    res.render('admin',{title:'admin portal'})
})
router.get('/employee-portal',(req,res)=>{
    res.render('employee',{title:'employee portal'})
})

module.exports=router;