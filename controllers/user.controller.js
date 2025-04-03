const {
    User,
    userValidator,
    loginValidator,
    resetPasswordValidator,
} = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const nodemailer = require("nodemailer");
const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config();

const {
    ACCESS_TOKEN,
    ACCESS_TOKEN_EXPIRES_IN,
    REFRESH_TOKEN,
    REFRESH_TOKEN_EXPIRES_IN,
    EMAIL,
    EMAIL_PASSWORD,
} = process.env;

// Access Token generator
const generateAccessToken = (user) => {
    return jwt.sign({ id: user._id }, ACCESS_TOKEN, {
        subject: "Access API",
        expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });
};

//Refresh token generator
const generateRefreshToken = (user) => {
    return jwt.sign({ id: user._id }, REFRESH_TOKEN, {
        subject: "Refresh API",
        expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    });
};

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const { error } = userValidator(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message });

        const existedUser = await User.findOne({ email });
        if (existedUser)
            return res.status(400).send({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            confirmPassword: hashedPassword,
        });
        await newUser.save();

        return res.status(201).send({
            message: "User Successfully Created",
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
            },
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { error } = loginValidator(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message });

        const user = await User.findOne({ email });
        if (!user)
            return res.status(401).send({ message: "Invald email or password" });

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch)
            return res.status(401).send({ message: "Invald email or password" });

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        user.refreshToken = refreshToken;
        await user.save();

        return res.status(200).send({
            message: "user Logged in successfully",
            user: {
                id: user._id,
                email: user.email,
                accessToken,
                refreshToken,
            },
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

const refreshToken = async (req, res) => {
    const { refreshToken, email } = req.body;
    let accessToken;
    try {
        const user = await User.findOne({ email });
        if (!user) res.status(400).send({ message: " email not found" });
        if (user.refreshToken === null)
            res.status(404).send({ message: " refresh token not found" });

        const decodedRefreshToken = jwt.verify(refreshToken, REFRESH_TOKEN);
        if (decodedRefreshToken) {
            accessToken = generateAccessToken(user);
        } else {
            return res.status(401).send({ message: "token invalid or expired" });
        }

        return res.status(200).send({
            id: user._id,
            accessToken,
        });
    } catch (error) {
        if (
            error instanceof jwt.TokenExpiredError ||
            error instanceof jwt.JsonWebTokenError
        ) {
            return res
                .status(400)
                .send({ message: "refresh token invalid or expired" });
        }
        res.status(500).send({ message: error.message });
    }
};

const logOut = async (req, res) => {
    const { refreshToken, email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) res.status(400).send({ message: " email not found" });

        const decoded = jwt.verify(refreshToken, REFRESH_TOKEN);
        if (!decoded)
            return res.status(401).send({ message: "Token invalid or expired" });

        user.refreshToken = null;
        user.save();

        return res.status(200).send({ message: "User successfully logged out" });
    } catch (error) {
        if (
            error instanceof jwt.TokenExpiredError ||
            error instanceof jwt.JsonWebTokenError
        ) {
            return res.status(400).send({ message: "refresh token invalid expired" });
        }
        return res.status(500).send({ message: error.message });
    }
};
const forgetPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) res.status(400).send({ massage: "User not found" });
        //generate Random otp
        const otp = crypto.randomInt(100000, 999999).toString();

        const transporter = nodemailer.createTransport({
            service: "gmail",
            debug: true, // Use `true` for port 465, `false` for all other ports
            auth: {
                user: EMAIL,
                pass: EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: EMAIL,
            to: user.email,
            subject: "Password Reset Otp",
            text: `Your OTP is ${otp}. It is valid for 15 minutes`,
            html: `<!DOCTYPE html>
  <html lang="en">
  
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your OTP Code</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f6f6f6;
              margin: 0;
              padding: 0;
              color: #333;
          }
  
          .container {
              max-width: 600px;
              margin: 50px auto;
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              overflow: hidden;
          }
  
          .header {
              background-color: #007bff;
              color: #ffffff;
              padding: 20px;
              text-align: center;
          }
  
          .header h1 {
              margin: 0;
              font-size: 24px;
          }
  
          .content {
              padding: 30px;
              text-align: center;
          }
  
          .content p {
              font-size: 16px;
              margin-bottom: 20px;
          }
  
          .otp {
              font-size: 30px;
              font-weight: bold;
              background-color: #f8f8f8;
              padding: 10px;
              border-radius: 5px;
              display: inline-block;
              margin-bottom: 30px;
          }
  
          .footer {
              background-color: #f6f6f6;
              color: #777777;
              padding: 20px;
              text-align: center;
              font-size: 14px;
          }
  
          .footer p {
              margin: 0;
          }
      </style>
  </head>
  
  <body>
      <div class="container">
          <div class="header">
              <h1>OTP Verification</h1>
          </div>
          <div class="content">
              <p>Hello,</p>
              <p>Thank you for using our service. Your One-Time Password (OTP) for verification is:</p>
              <div class="otp">${otp}</div>
              <p>Please enter this code to complete your verification. This OTP is valid for 10 minutes.</p>
          </div>
          <div class="footer">
              <p>If you did not request this code, please ignore this email.</p>
          </div>
      </div>
  </body>
  
  </html>
  `,
        };
        user.otpToken = otp;
        user.otpTokenExpiresIn = Date.now() + 15 * 60 * 1000; // valid for 15 minutes
        await user.save();
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) return res.status(400).send({ message: error });
            return res.status(200).send({
                message: "OTP sent to email",
            });
        });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

const verifyOtp = async (req, res) => {
    const { otpToken, email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).send({ message: "User not found" });
        if (user.otpToken !== otpToken) {
            return res.status(400).send({ message: "invalid Otp" });
        }
        if (user.otpTokenExpiresIn < Date.now())
            return res.status(400).send({ message: "OTP Expired" });

        user.otpToken = null;
        user.otpTokenExpiresIn = null;
        user.save();

        return res.status(200).send({ message: "OTP verified successfully" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

const resetPassword = async (req, res) => {
    const { error } = resetPasswordValidator(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });
    try {
        const { email, password, confirmPassword } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.findOneAndUpdate(
            { email },
            {
                password: hashedPassword,
                confirmPassword: hashedPassword,
            },
            {
                new: true,
                runValidators: true,
            }
        );
        if (!user) return res.status(400).send({ message: "user not found" });
        return res.status(200).send({ message: "Password Successfully updated" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}





module.exports = {
    register,
    login,
    refreshToken,
    logOut,
    forgetPassword,
    verifyOtp,
    resetPassword
};
