import { mongoClient } from "lib/mongo";
import { ObjectId } from "mongodb";

type flvRdbType = {
  title: string;
  workspace: ObjectId;
  properties: {
    id: string;
    type: string;
    name: string;
    option?: unknown;
  }[];
  created_at: Date;
  created_by: ObjectId;
  updated_at: Date;
  updated_by: ObjectId;
};

export const flvRdbCollection = mongoClient
  .db("flave")
  .collection<flvRdbType>("rdb");
