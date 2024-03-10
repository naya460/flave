import { FromSchema } from "json-schema-to-ts";
import { mongoClient, mongoHandler } from "lib/mongo";

export const createUserData = {
  type: "object",
  properties: {
    auth_id: { type: "string" },
    name: { type: "string" },
    hash: { type: "string" },
  },
  required: ["auth_id", "name", "hash"],
} as const;

export const createUser: mongoHandler<
  {
    auth_id: string;
    hash: string;
  },
  FromSchema<typeof createUserData>
> = async (data) => {
  const doc = {
    auth_id: data.auth_id,
    name: data.auth_id,
    hash: data.hash,
  };

  const result = await mongoClient
    .db("flave")
    .collection("user")
    .insertOne(doc);

  return {
    ok: result.acknowledged,
    data: doc,
  };
};
