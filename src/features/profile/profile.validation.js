const { z } = require("zod");

const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .optional(),

  bio: z.string().max(200, "Bio cannot exceed 200 characters").optional(),

  gender: z
    .enum(["male", "female", "other"], {
      message: "Gender must be male, female, or other",
    })
    .optional(),

  age: z
    .number()
    .min(18, "Age must be at least 18")
    .max(100, "Invalid age")
    .optional(),
});

module.exports = {
  updateProfileSchema,
};
