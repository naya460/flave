import { mongoClient } from "lib/mongo";
import { createUser } from "mongo/user/create";
import bcrypt from "bcrypt";

type flvUserType = {
  name: string;
  auth_id: string;
  hash: string;
  admin: boolean;
};

export const flvUserCollection = mongoClient
  .db("flave")
  .collection<flvUserType>("user");

flvUserCollection.countDocuments().then((count) => {
  if (count === 0) {
    bcrypt.hash("pass", 10).then((hash) => {
      createUser("admin", hash, true);
    });
  }
});

flvUserCollection.createIndex({ auth_id: 1 }, { unique: true });
