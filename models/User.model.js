const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const userSchema = new Schema({
    name: { type: String },
    photo: { type: String },
    email: { type: String, required: true, uniqued: true },
    password: { type: String, required: true },
});

userSchema.statics.register = async function (fname, email, password, repeatPassword) {
    if (!email || !password) {
        throw Error("All fields must be filled");
    }
    // if (!validator.isEmail(email)) {
    //   throw Error("Email is not valid");
    // }
    // if (await this.findOne({ email })) {
    //   throw Error("Email already in register");
    // }
    // if (password !== repeatPassword) {
    //   throw Error("Password not matched");
    // }
    // if (!validator.isStrongPassword(password)) {
    //   throw Error("Password not strong enough");
    // }

    const followers = await UserGroup.create({});
    const following = await UserGroup.create({});

    const newPassword = await bcrypt.hash(password, 10);
    const user = await this.create({
        name: fname,
        email: email,
        password: newPassword,
        followers: followers._id,
        following: following._id,
    });

    const token = await Token.create({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
    });

    const url = `${process.env.BASE_URL}user/${user._id}/verify/${token.token}`;

    await sendEmail(user.email, "Verify Email", url);

    return user;
};

userSchema.statics.login = async function (email, password) {
    if (!email || !password) {
        throw Error("All fields must be filled");
    }
    if (!validator.isEmail(email)) {
        throw Error("Email is not valid");
    }

    const user = await this.findOne({ email: email });
    if (!user) {
        throw Error("Invalid email");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
        return jwt.sign(
            { _id: user._id, email: user.email },
            process.env.SECRET_TOKEN,
            {
                expiresIn: "1d",
            }
        );
    } else {
        throw Error("Incorrect password");
    }
};

userSchema.statics.checkToken = async function (token) {
    if (!token) {
        throw new Error("Not authorized, please login");
    }
    const verified = jwt.verify(token, process.env.SECRET_TOKEN);
    const user = await this.findById(verified._id);
    if (!user) {
        throw new Error("Token not found or token has expired, please login");
    }
    return user;
};

userSchema.statics.changePassword = async function (
    user,
    oldPassword,
    newPassword,
    repeatNewPassword
) {
    if (!oldPassword || !newPassword || !repeatNewPassword) {
        throw new Error("All fields must be filled");
    }
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
        throw new Error("Old password is not valid");
    }
    if (newPassword !== repeatNewPassword) {
        throw new Error("Password not matched");
    }
    if (!validator.isStrongPassword(newPassword)) {
        throw Error("Password not strong enough");
    }
    if (user && isPasswordValid) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
    }
    return "Password changed";
};

module.exports.User = mongoose.model("User", userSchema);