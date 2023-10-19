exports.protect = async (req, res, next) => {
    try {
        const auth = req.headers.authorization;
        const token = auth.split(" ")[1];
        req.user = await User.checkToken(token);
        next();
    } catch (e) {
        res.status(401).json({
            title: "Unauthorized",
            status: 401,
            detail: "Full authentication is required to access this resource",
            path: req.originalUrl,
            message: "error.http.401"
        });
    }
};
