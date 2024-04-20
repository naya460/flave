import { checkAuth } from "api/common/check_auth";
import { FromSchema } from "json-schema-to-ts";
import { apiHandler } from "lib/fastify";
import { getPageList } from "mongo/page/get_list";

const queryStringSchema = {
  type: "object",
  properties: {
    parent: { type: "string" },
  },
  required: ["parent"],
} as const;

export const flvGetPageListSchema = {
  querystring: queryStringSchema,
};

export const flvGetPageList: apiHandler<{
  Querystring: FromSchema<typeof queryStringSchema>;
}> = async (req, res) => {
  const auth = await checkAuth({ page: req.query.parent }, req, res);
  if (auth === null) return;

  res.status(200);
  res.type("application/json");
  return await getPageList({ parent: req.query.parent });
};
