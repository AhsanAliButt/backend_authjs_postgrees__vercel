export const register = async (values: any) => {
  const response = await fetch(`/api/auth/signup`, {
    method: "POST",
    body: JSON.stringify({
      firstname: values.firstname,
      lastname: values.lastname,
      email: values.email,
      password: values.password,
      username: values.username,
    }),
  });
  return response;
};

export const becomeSeller = async () => {};
