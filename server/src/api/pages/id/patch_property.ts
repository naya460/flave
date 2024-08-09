import { checkAuth } from "api/common/check_auth";
import { validate_constraint } from "flave_types/property_type";
import { FromSchema } from "json-schema-to-ts";
import { apiHandler } from "lib/fastify";
import { getPageData } from "mongo/page/get_data";
import { updatePageConstraint } from "mongo/page/update_constraint";
import { updatePageProperty } from "mongo/page/update_property";
import { getRdbData } from "mongo/rdb/get_data";
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

  const page_data = await getPageData(req.params.page_id);
  if (page_data !== null && page_data.rdb !== undefined) {
    const constraints = (await getRdbData(page_data.rdb))?.constraints;
    if (constraints !== undefined) {
      for (const constraint of constraints) {
        const result = await validate_constraint(
          page_data.rdb.toString(),
          constraint.id,
          req.body.value
        );
        updatePageConstraint(new ObjectId(req.params.page_id), auth, {
          id: constraint.id,
          result,
        });
      }
    }
  }

  res.status(200);
  return;
};
