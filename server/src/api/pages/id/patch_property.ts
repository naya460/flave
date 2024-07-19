import { checkAuth } from "api/common/check_auth";
import { FromSchema } from "json-schema-to-ts";
import { apiHandler } from "lib/fastify";
import { updatePageProperty } from "mongo/page/update_property";
import { ObjectId } from "mongodb";

const paramsSchema = {
  type: "object",
  properties: {
    page_id: { type: "string" },
    property_id: { type: "string" },
  },
  required: ["page_id", "property_id"],
} as const;

const bodySchema = {
  type: "object",
  properties: {
    value: { type: ["string", "boolean", "object"] },
  },
  required: ["value"],
} as const;

export const flvPatchPagePropertySchema = {
  params: paramsSchema,
  body: bodySchema,
};

export const flvPatchPagePropertyHandler: apiHandler<{
  Params: FromSchema<typeof paramsSchema>;
  Body: FromSchema<typeof bodySchema>;
}> = async (req, res) => {
  const auth = await checkAuth({ page: req.params.page_id }, req, res);
  if (auth === null) return;

  const result = await updatePageProperty(
    new ObjectId(req.params.page_id),
    auth,
    {
      id: req.params.property_id,
      value: req.body.value,
    }
  );

  if (result === false) {
    res.status(400);
    return;
  }

  res.status(200);
  return;
};
