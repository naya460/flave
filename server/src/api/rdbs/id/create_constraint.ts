import { checkAuth } from "api/common/check_auth";
import { FromSchema } from "json-schema-to-ts";
import { apiHandler } from "lib/fastify";
import { createRdbConstrant } from "mongo/rdb/constraints/create";
import { ObjectId } from "mongodb";

const paramsSchema = {
  type: "object",
  properties: {
    rdb_id: { type: "string" },
  },
  required: ["rdb_id"],
} as const;

const bodySchema = {
  type: "object",
  properties: {
    type: { type: "string" },
    option: { type: "object" },
  },
  required: ["type", "option"],
} as const;

export const flvCreateRdbConstraintSchema = {
  params: paramsSchema,
  body: bodySchema,
};

export const flvCreateRdbConstraintHandler: apiHandler<{
  Params: FromSchema<typeof paramsSchema>;
  Body: FromSchema<typeof bodySchema>;
}> = async (req, res) => {
  const auth = await checkAuth({ rdb: req.params.rdb_id }, req, res);
  if (auth === null) return;

  if (
    req.body.type !== "unique" &&
    req.body.type !== "not null" &&
    req.body.type !== "check"
  ) {
    res.status(400);
    return;
  }

  switch (req.body.type) {
    case "unique": {
      if (
        !(
          "target" in req.body.option &&
          typeof req.body.option.target === "object" &&
          Array.isArray(req.body.option.target) &&
          req.body.option.target.length !== 0
        )
      ) {
        res.status(400);
        return;
      }
      break;
    }
    case "not null": {
      res.status(400);
      return;
    }
    case "check": {
      res.status(400);
      return;
    }
  }

  const doc: {
    type: "unique" | "not null" | "check";
    option: object;
  } = {
    type: req.body.type,
    option: req.body.option,
  };

  const result = await createRdbConstrant(
    new ObjectId(req.params.rdb_id),
    auth,
    {
      constraint: doc,
    }
  );

  if (result === null) {
    res.status(400);
    return;
  }

  res.status(200);
  res.type("text/plain");
  return result;
};
