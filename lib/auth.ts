import jwt from "jsonwebtoken"

export const signToken = (payload: any) => {
  const secret = process.env.JWT_SECRET
}
