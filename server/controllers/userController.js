const User = require('../models/User.js');
const AppError = require('../utils/errorUtil.js');

const cookieOptions = {
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  httpOnly: true,
  secure: true, // Note: Set to true if deploying over HTTPS
};

const register = async (req, res, next) => {
    console.log(req)
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    return next(new AppError("All fields are required", 400));
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return next(new AppError("Email already exists!", 400));
    }

    const newUser = await User.create({
      fullName,
      email,
      password,
    });

    const token = await newUser.generateJWTToken();
    newUser.password = undefined; // Ensure password is not sent in response

    res.cookie("token", token, cookieOptions);

    res.status(201).json({
      success: true,
      message: "User registered and logged in successfully!",
      user: {
        fullName: newUser.fullName,
        email: newUser.email,
      },
    });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError("Email and Password are required", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError("Email or password does not match", 400));
    }

    const token = await user.generateJWTToken();
    user.password = undefined; // Ensure password is not sent in response

    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      success: true,
      message: "User logged in successfully!",
      user,
    });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};

module.exports = {
  register,
  login,
};
