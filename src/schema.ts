import { z } from "zod";
export const schema = z.object({
    name: z.string().min(2).max(50),
    gender: z.enum(["male", "female"]),
    isVerified: z.boolean().refine(value => value === true, {
      message: "Value must be true",
    }),
    mobileNumber:z.string().min(4),
    numberOfProjects:z.string().min(1)
  });