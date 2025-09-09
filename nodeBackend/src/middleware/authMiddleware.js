const jwt = require ('jsonwebtoken');

const authMiddleware = (req, res , next)=>{
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ") ) {
        return res.status(401).json({message: 'No token provided'})
    }

    const token = authHeader.split(" ")[1]

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        req.user= decode;

        next();

    } catch (error) {
        return res.status(401).json({message: 'Expired Token'})
    }
}

module.exports = authMiddleware