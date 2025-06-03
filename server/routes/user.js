const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const { authCheck, adminCheck } = require('../middlewares/authCheck');
const userController = require('../controller/userController');

router.put('/update-picture', authCheck, upload.single('picture'), userController.updatePicture);

router.get('/me', authCheck, userController.me); 
router.get('/', authCheck, adminCheck, userController.listUsers);
router.get('/:id', authCheck, userController.getUser);
router.put('/:id', authCheck, adminCheck, userController.updateUser);
router.delete('/:id', authCheck, userController.deleteUser);

module.exports = router;
