import { checkAuth } from "api/common/check_auth";
import { FromSchema } from "json-schema-to-ts";
import { apiHandler } from "lib/fastify";
import { getPageData } from "mongo/page/get_data";

const paramsSchema = {
  type: "object",
  properties: {
    page_id: { type: "string" },
  },
  required: ["page_id"],
} as const;

export const flvGetPagePathSchema = {
  params: paramsSchema,
};

export const flvGetPagePathHandler: apiHandler<{
  Params: FromSchema<typeof paramsSchema>;
  Reply: undefined;
}> = async (req, res) => {
  const auth = await checkAuth("auth", req, res);
  if (auth === null) return null;

  const pages: string[] = [];
  let current_page_id = req.params.page_id;
  while (current_page_id !== undefined) {
    const data = await getPageData(current_page_id);
    if (data?.parent === undefined) break;
    pages.unshift(data.parent.toString());
    current_page_id = data.parent.toString();
  }

  res.status(200);
  res.type("application/json");
  return pages;
};
