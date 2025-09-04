const User = require ('../models/User');

// @desc Get all users
// @route GET /api/v1/users
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

// @desc  create users
// @route  POST /api/v1/users

exports.createUser = async (req, res) => {
    try {
        const {name, email , password } = req.body

        //validate 
        if (!name || !email || !password) {
            return res.status(400).json({message: "All Field are required"})
        }

        //check duplicate email
        const existingUser = await User.findOne({email});
            if (existingUser) {
                return res.status(400).json({message: "Email already exist"})
            }

        //save user details 
        const newUser = new User({name, email , password});
            await newUser.save();
            res.status(201).json(newUser);


    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

// @desc Get single user
// @route GET /api/v1/users/:id

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) {
            return res.status(404).json({message: "User not found"})
        } 
         res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

// @desc update user
// @route PUT /api/v1/users/:id

exports.updateUser = async (req, res) => {
   try {
       
        const {name, email , password } = req.body

        const user = await User.findByIdAndUpdate( 
        req.params.id,
        {name, email , password },
        {new: true, runValidators: true}
        )

        if (!user) {
        return res.status(404).json({message: "User not found"})
        }

       res.status(200).json(user)
   } catch (error) {
        res.status(500).json({message: error.message});
   }
}

// @desc delete user
// @route DELETE /api/v1/users/:id

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user) {
            return res.status(404).json({message: "User not found"})
        }
         res.status(200).json({message: "User deleted Successfully"})
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}