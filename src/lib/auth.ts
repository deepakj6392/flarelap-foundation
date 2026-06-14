import jwt from "jsonwebtoken";

export function verifyAdmin(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];
  try {
    const jwtSecret = process.env.JWT_SECRET || "flarelap_foundation_jwt_secret_key_123!";
    const decoded = jwt.verify(token, jwtSecret) as any;
    if (decoded && decoded.role === "super_admin") {
      return decoded;
    }
    return null;
  } catch (error) {
    return null;
  }
}
