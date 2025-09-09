const User = require ('../models/User')
const bcrypt = require ('bcryptjs')
const jwt = require ('jsonwebtoken')



// @desc Register Users
// @route POST /api/v1/auth/register
exports.Register = async (req, res) => {
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


        //Create password hash variable

    const hashedPassword = await bcrypt.hash(password, 10);

    //save user details 
    const newUser = new User({name, email , password: hashedPassword});
    await newUser.save();
    res.status(201).json(newUser);
            
   } catch (error) {
        res.status(500).json({message: error.message});
   }
}


// @desc Login Users
// @route POST /api/v1/auth/login

exports.Login = async (req, res) => {
    try {
        const {email , password } = req.body;
         
        //validate request
        if ( !email || !password) {
            return res.status(400).json({message: "All Field are required"})
        }

        //duplicate
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({message: "Invalid Credentials"})
        }

        //compare password
        const isMatched = await bcrypt.compare(password, user.password);
        if (!isMatched) {
            return res.status(400).json({message: "Password do not match"})
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.json({token});


    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

