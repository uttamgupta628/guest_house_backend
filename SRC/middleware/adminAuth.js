import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apierror.js";

export const verifyAdminToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
console.log("Token header:", req.headers.authorization);

  if (!token) {
    throw new ApiError(401, "Admin token missing");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      throw new ApiError(403, "Unauthorized: Not an admin");
    }

    req.admin = decoded;
    next();
  } catch (error) {
    throw new ApiError(401, "Invalid or expired admin token");
  }
};
