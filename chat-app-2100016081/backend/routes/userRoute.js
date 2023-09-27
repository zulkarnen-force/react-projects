const express = require('express');
const { registerUser, authUser, allUsers, deleteUser } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/signup').post(registerUser);
router.post('/login', authUser);
router.get('/', protect, allUsers)
router.route('/:id').delete(protect, deleteUser);


module.exports = router;