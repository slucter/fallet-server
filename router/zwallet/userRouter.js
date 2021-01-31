const express = require('express');
const router = express.Router();
const user = require('./../../controller/zwalletController/userController');
const { authorization, upload, validation, size } = require('./../../midleware/index');
router
        .get('/', authorization, user.getAll)
        .post('/signup', user.signupUser)
        .post('/signin', user.loginUser)
        .patch('/setPin/', authorization, user.setUserPin)
        .post('/sendMail', user.sendLinkPass)
        .patch('/changePassword',authorization, user.changeNewPassword)
        .get('/:id', user.getById)
        .put('/update/:id', authorization, user.updateUser)
        .patch('/upload/img/:id', upload.single('image'), validation ,user.patchImage)
        .patch('/update/personalSetting/:id', user.patchUserSetting)
        .patch('/verif/:token', user.patch_verified)
        .delete('/delete/:id',authorization, user.deleteUser)

module.exports = router