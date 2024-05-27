const jwt = require("jsonwebtoken");
const {User} = require("../db/models/User");
const authMiddleware = async (req, res, next) =>{
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({
            message: "Authentication is required"
        })
    }
    
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //console.log(decoded)
        const user = await User.findById(decoded.userId);
        req.userId = user._id;
        //console.log(user)
        if(!user){
            return res.status(401).json({
                message: "Unauthorized access. User not found"
            })
        }
        next()
    } catch (error) {
        if(error.name == "TokenExpiredError"){
            return res.status(401).json({message: "Authentication Failed. Token expired"})
        }else{
            return res.status(401).json({message: "Authentication failed"})
        }
    }
}

module.exports ={ authMiddleware};