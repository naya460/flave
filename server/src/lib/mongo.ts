import { MongoClient } from "mongodb";

export const mongoClient = new MongoClient(
  "mongodb://root:password@mongo:27017/"
);
mongoClient.connect().then().catch(console.error);

export type mongoHandler<InputDataType, ReturnDataType> = (
  data: InputDataType
) => Promise<{
  ok: boolean;
  data: ReturnDataType;
}>;
