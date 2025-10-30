import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { userModel } from "../models/userModel.js";

export interface ExtendedRequest extends Request {
  user?: any; // you can make this a specific User type if you have one
}

// 2️⃣ JWT validation middleware
const validateJWT = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
  try {
    const authorizationHeader = req.get("authorization");

    if (!authorizationHeader) {
      return res.status(400).send("Authorization header not provided");
    }

    // FIX: split by space (" "), not an empty string ("")
    // Format should be: "Bearer <token>"
    const token = authorizationHeader.split(" ")[1];

    if (!token) {
      return res.status(403).send("Token not provided");
    }

    // Verify the token
    jwt.verify(token, "mySecretKey", async (err, payload) => {
      if (err) {
        return res.status(403).send("Invalid token");
      }

      if (!payload) {
        return res.status(403).send("Invalid token payload");
      }

      // Extract user info from token payload
      const userPayload = payload as { email: string };

      // Find user in database (await since it's async)
      const user = await userModel.findOne({ email: userPayload.email });

      if (!user) {
        return res.status(404).send("User not found");
      }

      // Attach user to the request
      req.user = user;

      // Continue to the next middleware or route
      next();
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};

export default validateJWT;