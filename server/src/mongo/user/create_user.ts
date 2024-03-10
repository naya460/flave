import { FromSchema } from "json-schema-to-ts";
import { mongoClient } from "lib/mongo";

export const createUserData = {
  type: "object",
  properties: {
    auth_id: { type: "string" },
    name: { type: "string" },
    hash: { type: "string" },
  },
  required: ["auth_id", "name", "hash"],
} as const;

export async function createUser(
  auth_id: string,
  hash: string
): Promise<{ ok: boolean; data: FromSchema<typeof createUserData> }> {
  const data = {
    auth_id,
    name: auth_id,
    hash,
  };

  const result = await mongoClient
    .db("flave")
    .collection("user")
    .insertOne(data);

  return {
    ok: result.acknowledged,
    data,
  };
}
