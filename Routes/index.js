const express = require('express')
const router = express.Router() 


//user routes
router.use('/auth', require('./User/Auth'))
router.use('/profile',require("./User/Profile"))

//campaign routes
router.use('/campaign', require('./Campaign'))

//message routes
router.use('/notification', require('./Notification'))

//admin routes
router.use('/admin/auth', require('./Admin/AdminAuth'))
router.use('/admin/user', require('./Admin/AdminUser'))



module.exports = router;