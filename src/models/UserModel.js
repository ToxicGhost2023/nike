export const UserModel = {
  collectionName: "users",

  userDocument: (data) => ({
    fullName: data.fullName,
    email: data.email.toLowerCase(),
    password: data.password || null,
    role: data.role || "user",
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
};
