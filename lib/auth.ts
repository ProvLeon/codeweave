import jwt from "jsonwebtoken"

export const signToken = (payload: any) => {
  const secret = process.env.JWT_SECRET || "sjkkiej39=3ri2ejflsjdljlad93r0ikw+u3rlka"
  return jwt.sign(payload, secret, { expiresIn: "1h"})
}

export const verifyToken = (token: string) => {
  const secret = process.env.JWT_SECRET || "sjkkiej39=3ri2ejflsjdljlad93r0ikw+u3rlka"

  try {
    const decoded = jwt.verify(token, secret)
    return decoded;
  } catch (err) {
    return null
  }
}
