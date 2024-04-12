import { mongoClient } from "lib/mongo";
import { ObjectId } from "mongodb";

type flvPageType = {
  title: string;
  workspace: ObjectId;
  created_at: Date;
  created_by: ObjectId;
  updated_at: Date;
  updated_by: ObjectId;
  parent?: ObjectId;
};

export const flvPageCollection = mongoClient
  .db("flave")
  .collection<flvPageType>("page");
