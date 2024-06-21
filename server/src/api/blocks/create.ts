import { checkAuth } from "api/common/check_auth";
import { validate_block } from "flave_types/block_type";
import { FromSchema } from "json-schema-to-ts";
import { apiHandler } from "lib/fastify";
import { createBlock } from "mongo/block/create";

const bodySchema = {
  type: "object",
  properties: {
    page_id: { type: "string" },
    next_of: { type: ["string", "null"] },
    type: { type: "string" },
    data: { type: "object" },
  },
  required: ["page_id", "next_of", "type", "data"],
} as const;

export const flvCreateBlockSchema = {
  body: bodySchema,
};

export const flvCreateBlockHandler: apiHandler<{
  Body: FromSchema<typeof bodySchema>;
}> = async (req, res) => {
  const auth = await checkAuth({ page: req.body.page_id }, req, res);
  if (auth === null) return;

  if (validate_block(req.body.type, req.body.data) === false) {
    res.status(400);
    return;
  }

  const result = await createBlock(
    req.body.page_id,
    req.body.next_of,
    req.body.type,
    req.body.data,
    auth
  );

  if (result === null) {
    res.status(400);
    return;
  }

  res.status(200);
  res.type("text/plain");
  return result.toString();
};
