const { z } = require("zod");

const signupSchema = z.object({
  name: z.string().trim().min(3, "Name must be at least 3 characters"),

  email: z.string().email("Invalid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(50, "Password is too long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      "Password must contain uppercase, lowercase, number and special character",
    ),

  gender: z.enum(["male", "female", "other"], {
    message: "Gender must be male, female, or other",
  }),

  age: z.number().min(18, "Age must be at least 18").max(100, "Invalid age"),
});
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),

  password: z.string().min(8, "Password must be at least 8 characters"),
});

module.exports = {
  signupSchema,
  loginSchema,
};
