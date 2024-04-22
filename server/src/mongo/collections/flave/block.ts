import { mongoClient } from "lib/mongo";
import { ObjectId } from "mongodb";

type flvBlockType = {
  page: ObjectId;
  next_of: ObjectId | null;
  type: "paragraph";
  data: unknown;
  created_at: Date;
  created_by: ObjectId;
  updated_at: Date;
  updated_by: ObjectId;
};

export const flvBlockCollection = mongoClient
  .db("flave")
  .collection<flvBlockType>("block");
