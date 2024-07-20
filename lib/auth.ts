import jwt from "jsonwebtoken"
import { decode, encode } from "next-auth/jwt"

export const signToken = (payload: any) => {
  const secret = process.env.JWT_SECRET || "sjkkiej39=3ri2ejflsjdljlad93r0ikw+u3rlka"
  try {
    const token = encode({
      token: { userId: payload.userId }, // Ensure payload is an object
      secret: secret,
      salt: "some_salt_value"
    })
    return token
  } catch (err) {
    throw err
  }
}

export const verifyToken = (token: any) => {
  //const secret = process.env.JWT_SECRET || "sjkkiej39=3ri2ejflsjdljlad93r0ikw+u3rlka"

  try {
    //const decoded = jwt.verify(token, secret)
    const decoded = decode(token)
    console.log({"decoded": decoded})
    return decoded;
  } catch (err) {
    throw err
  }
}
