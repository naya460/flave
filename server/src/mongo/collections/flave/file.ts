import { mongoClient } from "lib/mongo";
import { ObjectId } from "mongodb";

type flvFileType = {
  workspace: ObjectId;
  type: "image";
  data: string;
};

export const flvFileCollection = mongoClient
  .db("flave")
  .collection<flvFileType>("file");
