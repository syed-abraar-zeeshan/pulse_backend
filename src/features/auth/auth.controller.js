const User = require("./user.model");
const bcrypt = require("bcryptjs");
const { signupSchema, loginSchema } = require("./auth.validation");
const { success } = require("zod");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  const validationResult = signupSchema.safeParse(req.body);

  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      errors: validationResult.error.flatten().fieldErrors,
    });
  }

  const userData = validationResult.data;

  const { email, password } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "User already exists",
    });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  userData.password = hashedPassword;

  // Save user to MongoDB
  const user = await User.create(userData);

  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: user,
  });
};

const login = async (req, res) => {
  // Validate request body
  const validationResult = loginSchema.safeParse(req.body);

  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      errors: validationResult.error.flatten().fieldErrors,
    });
  }

  // Extract validated data
  const { email, password } = validationResult.data;

  // Find user by email
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  // Compare passwords
  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  // Generate JWT token
  const token = jwt.sign(
    {
      userId: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
  );

  // Send response
  return res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    data: user,
  });
};

module.exports = { signup, login };
