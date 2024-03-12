import { mongoClient } from "lib/mongo";
import { ObjectId } from "mongodb";

type flvSessionType = {
  user_id: ObjectId;
};

export const flvSessionCollection = mongoClient
  .db("flave")
  .collection<flvSessionType>("session");
