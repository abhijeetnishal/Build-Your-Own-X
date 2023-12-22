const getProfileDetails = async (token: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/user/details`,
    {
      method: "GET",
      headers: {
        "content-type": "application/json",
        "x-auth-token": token,
      },
    }
  );

  return response;
};

export default getProfileDetails;