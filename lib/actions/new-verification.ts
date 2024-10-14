"use server";

import { getVerificationTokenByToken } from "../verificationToken";
import { getUserByEmail } from "./user";

const VerifyToken = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return { message: "Token Does not exist", status: 401 };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { message: "Token expired", status: 401 };
  }
  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { message: "Email Not Exist", status: 401 };
  }

  await prisma.user.update({
    where: { id: existingUser.id },
    data: {
      verified: new Date(),
      email: existingToken.email,
    },
  });
  await prisma.verificationToken.delete({
    where: { id: existingToken.id },
  });

  return { message: "Email Verified Please Login Now", status: 201 };
};

export default VerifyToken;
