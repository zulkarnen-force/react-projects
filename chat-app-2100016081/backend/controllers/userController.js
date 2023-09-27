const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const generateToken = require('../config/generateToken');

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Mohon isi semua kolom!');
    }

    // Mengecek apakah user sudah ada
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User sudah ada');
    }

    // Membuat user baru
    const user = await User.create({
        name,
        email,
        password,
        pic
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id)
        });
    } else {
        res.status(400);
        throw new Error('Data user tidak valid');
    }

});

const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id)
        });
        res.json(user);
    } else {
        res.status(401);
        throw new Error('Email atau password salah');
    }
});

const allUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
        ]
    } : {};

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } })
    res.send(users);
});

const deleteUser = asyncHandler(async (req, res) => {
    const userId = req.params.id;

    // Mencari pengguna yang akan dihapus
    const user = await User.findById(userId);

    if (user) {
        // Menghapus pengguna
        await user.deleteOne();
        res.json({ message: 'Pengguna berhasil dihapus' });
    } else {
        res.status(404);
        throw new Error('Pengguna tidak ditemukan');
    }
});

module.exports = { registerUser, authUser, allUsers, deleteUser };