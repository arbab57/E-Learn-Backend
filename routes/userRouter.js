const router = require('express').Router()
const authControll = require("../controller/authControl")
const { verifyUserToken } = require('../middleware/authUser')



router.post("/register", authControll.register)
router.post("/login", authControll.login)
router.post("/signout", authControll.SignOut)
router.get("/test",verifyUserToken, authControll.test)
router.delete("/delete", authControll.deleteUser)



module.exports = router ;