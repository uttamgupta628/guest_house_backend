import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apierror.js";

export const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Unauthorized. Token not provided.");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    throw new ApiError(401, "Invalid or expired token.");
  }
};
