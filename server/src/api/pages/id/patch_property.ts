import { checkAuth } from "api/common/check_auth";
import { validate_property } from "flave_types/property_type";
import { FromSchema } from "json-schema-to-ts";
import { apiHandler } from "lib/fastify";
import { getPageData } from "mongo/page/get_data";
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

  const data_type = await (async () => {
    const rdb_id = (await getPageData(req.params.page_id))?.rdb;
    if (rdb_id === undefined) return null;
    const property = (await getRdbData(rdb_id))?.properties.find(
      (v) => v.id === req.params.property_id
    );
    if (property === undefined) return null;
    return property.type;
  })();
  if (data_type === null) {
    res.status(400);
    return;
  }

  if (validate_property(data_type, req.body.value) === false) {
    res.status(400);
    return;
  }

  const result = await updatePageProperty(
    new ObjectId(req.params.page_id),
    auth,
    {
      property: {
        id: req.params.property_id,
        value: req.body.value,
      },
    }
  );

  if (result === false) {
    res.status(400);
    return;
  }

  res.status(200);
  return;
};
