export const UserModel = {
  collectionName: "users",

  userDocument: (data) => ({
    fullName: data.fullName,
    email: data.email.toLowerCase(),
    password: data.password || null,
    role: data.role || "user",

    address: [
      {
        state: "",
        city: "",
        street: "",
        postalCode: "",
        receiverName: "",
        phone: "",
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
};
