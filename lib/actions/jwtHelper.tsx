import { SignJWT, jwtVerify } from "jose";

export const signJWT = async (
  payload: { email: string; password?: string },
  options: { exp: string }
) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY || "");
    const alg = "HS256";
    return new SignJWT(payload)
      .setProtectedHeader({ alg })
      .setExpirationTime(options.exp)
      .setIssuedAt()
      .setSubject(payload.email)
      .sign(secret);
  } catch (error) {
    throw error;
  }
};

export const verifyJWT = async (token: string) => {
  if (!token) {
    return { success: false, error: true, message: "Your token has expired" };
  }
  try {
    const response = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET_KEY)
    );
    if ("email" in response.payload) {
      const { email, password } = response.payload;
      return { email, password, error: false, success: true };
    } else {
      const { sub } = response.payload;
      return { sub, error: false, success: true };
    }
  } catch (error) {
    console.log(error);
    return { success: false, error: true, message: "Your token has expired" };
  }
};