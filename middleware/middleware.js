const jwt = require("jsonwebtoken");
const { User, userSchema } = require('../models/User.model')

exports.protect = async (req, res, next) => {
    try {
        const auth = req.headers.authorization;
        if(!auth) {
            throw new Error("Not authorized, please login");
        }

        const token = auth.split(" ")[1];
        if (!token) {
            throw new Error("Not authorized, please login");
        }

        const verified = jwt.verify(token, process.env.SECRET_TOKEN);
        const user = await User.findById(verified._id);
        
        if (!user) {
            throw new Error("Token not found or token has expired, please login");
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({
            title: "Unauthorized",
            status: 401,
            detail: error.message,
            path: req.originalUrl,
            message: "error.http.401"
        });
    }
};

exports.wrapResponse = (req, res, next) => {
    const originalJson = res.json;

    res.json = function (data) {
        const wrappedData = {
            data: data,
            meta: {
                method: req.method,
                path: req?.originalUrl,
                total: data?.length,
                timestamp: new Date().toISOString(),
            },
        };

        originalJson.call(res, wrappedData);
    };

    next();
};
