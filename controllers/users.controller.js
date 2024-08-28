import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import asyncHandler from "../middleware/asyncHandler.js";
import generateToken from "../utils/generateToken.js";

export const register = asyncHandler(async (req, res) => {
    const count = 1;
    try {
        const { id, first_name, last_name, email, domain, gender, avatar, password, available } = req.body;
        if (!id || !first_name || !last_name || !email || !domain || !gender || !avatar || !password || !available) {
            throw new Error("Please fill all the input")
        }


        const user = await User.findOne({ email });
        if (user) {
            return res.status(200).send({
                message: "User already exists",
                error: true,
                success: false
            })
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);
        const newUser = new User({ id, first_name, last_name, email, domain, gender, avatar, available, password: hashedPassword })

        try {
            await newUser.save();
            generateToken(res, newUser._id);
            res.status(201).json({
                _id: newUser.id,
                email: newUser.email,
                first_name: newUser.first_name,
                last_name: newUser.last_name,
                domain: newUser.domain,
                gender: newUser.gender,
                available: newUser.available,
                avatar: newUser.avatar,
                success: true,
                message: "User created successfully",

            })
        } catch (error) {
            res.json({
                message: error.message || error,
                error: true,
                success: true
            })
        }



    } catch (error) {
        console.log(error);

    }
})

export const getUserById = asyncHandler(async (req, res) => {
    try {

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false
            })
        }
        res.json({
            _id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            domain: user.domain,
            gender: user.gender,
            available: user.available,
            avatar: user.avatar,
            success: true,
        })
    } catch (error) {
        res.json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
})

export const deleteUserById = asyncHandler(async (req, res) => {
    try {

        const user = await User.findOne(req.params.id);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false
            })
        }

        await user.deleteOne(user);
        res.json({
            error: false,
            success: true,
        })
    } catch (error) {
        res.json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
})

export const getAllUser = asyncHandler(async (req, res) => {
    let query = {};
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 20;
    const domain = req.query.domain || ''
    const gender = req.query.gender || ''
    const available = req.query.available || ''
    const search = req.query.search || '';

    let skip = (page - 1) * limit;
    const searchRegex = new RegExp(search, 'i');





    query = {

        ...query,
        $or: [{ first_name: searchRegex }, { last_name: searchRegex }],
        ...(domain.length > 0 && { domain: { $in: domain } }),
        ...(gender.length > 0 && { gender: { $in: gender } }),
        ...(available.length > 0 && { available: { $in: available } }),
    };


    const users = await User.find(query).skip(skip).limit(limit)
    const total = await User.countDocuments(query)
    res.json({
        users,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
        success: true,
    });
})

export const updateUserById = asyncHandler(async (req, res) => {
    try {



        const user = await User.findById(req.params.id);
        if (user) {
            user.first_name = req.body.first_name || user.first_name;
            user.last_name = req.body.last_name || user.last_name;
            user.email = req.body.email || user.email;
            user.domain = req.body.domain || user.domain;
            user.gender = req.body.gender || user.gender;
            user.avatar = req.body.avatar || user.avatar;
            user.available = req.body.available || user.available;
            if (req.body.password) {
                const salt = await bcryptjs.genSalt(10);
                const hashedPassword = await bcryptjs.hash(req.body.password, salt);
                user.password = hashedPassword;
            }
            const updatedUser = await user.save();
            res.json({
                _id: updatedUser.id,
                email: updatedUser.email,
                first_name: updatedUser.first_name,
                last_name: updatedUser.last_name,
                domain: updatedUser.domain,
                gender: updatedUser.gender,
                available: updatedUser.available,
                avatar: updatedUser.avatar,
                success: true,
                message: "User updated successfully",
            })

        }



    } catch (error) {
        res.json({
            message: error.message || error,
            error: true,
            success: false
        })

    }
})