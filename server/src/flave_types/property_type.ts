import { getPageData } from "mongo/page/get_data";
import { flave_var_type, validate_var } from "./var_type";
import { getRdbData } from "mongo/rdb/get_data";
import { ObjectId } from "mongodb";
import { flvPageCollection } from "mongo/collections/flave/page";

// Map<type_name, data_type>
export const flave_property_type = new Map<
  string,
  {
    type:
      | {
          [key in string]: flave_var_type;
        }
      | "string"
      | "boolean";
    validate_option?: (
      option: unknown,
      data: object | string | boolean
    ) => Promise<boolean>;
  }
>();

export async function validate_property(
  page_id: string,
  property_id: string,
  data: object | string | boolean
): Promise<boolean> {
  const rdb_id = (await getPageData(page_id))?.rdb;
  if (rdb_id === undefined) return false;

  const property = (await getRdbData(rdb_id))?.properties.find(
    (v) => v.id === property_id
  );
  if (property === undefined) return false;

  const data_type = property.type;

  if (data_type === null) {
    return false;
  }

  return (
    validate_data_type(data_type, data) &&
    (await validate_option(data_type, property?.option, data))
  );
}

function validate_data_type(
  type: string,
  data: object | string | boolean
): boolean {
  if (typeof data === "object") {
    const data_type = flave_property_type.get(type)?.type;
    if (data_type === undefined) return false;
    if (typeof data_type !== "object") return false;

    const target = data as { [key in string]: unknown };

    for (const [key, target_data] of Object.entries(target)) {
      const var_type = data_type[key];
      if (var_type === undefined) return false;
      if (validate_var(var_type, target_data) === false) return false;
    }
  } else {
    const data_type = flave_property_type.get(type)?.type;
    if (data_type === undefined) return false;
    if (typeof data_type === "object") return false;
    if (typeof data !== data_type) return false;
  }
  return true;
}

export function exists_property(type: string): boolean {
  return flave_property_type.has(type);
}

async function validate_option(
  type: string,
  option: unknown,
  data: object | string | boolean
): Promise<boolean> {
  const option_validator = flave_property_type.get(type)?.validate_option;
  if (option_validator === undefined) {
    return true;
  }

  return await option_validator(option, data);
}

// text
flave_property_type.set("text", {
  type: "string",
});

// checkbox
flave_property_type.set("checkbox", {
  type: "boolean",
});

// relation
flave_property_type.set("relation", {
  type: {
    page_list: {
      type: "array",
      children: "string",
    },
  },
  validate_option: async (option, data) => {
    const rdb_option: {
      only: boolean;
    } | null = (() => {
      if (
        typeof option === "object" &&
        option !== null &&
        "only" in option &&
        typeof option.only === "boolean"
      ) {
        return {
          only: option.only,
        };
      } else {
        return null;
      }
    })();

    if (rdb_option === null) {
      return false;
    }

    // only
    if (rdb_option.only === true) {
      if (
        !(
          typeof data === "object" &&
          "page_list" in data &&
          typeof data.page_list === "object" &&
          Array.isArray(data.page_list) &&
          data.page_list.length <= 1
        )
      ) {
        return false;
      }
    }

    return true;
  },
});

export async function validate_constraint(
  rdb_id: string,
  constraint_id: string,
  data: object | string | boolean
): Promise<boolean> {
  const rdb_data = await getRdbData(new ObjectId(rdb_id));
  if (rdb_data === null) return false;

  const constraint = rdb_data.constraints?.find((v) => v.id === constraint_id);
  if (constraint === undefined) return false;

  switch (constraint.type) {
    case "unique": {
      if (
        "target" in constraint.option &&
        Array.isArray(constraint.option.target)
      ) {
        for (const property_id of constraint.option.target) {
          if (typeof property_id !== "string") return false;
          const count = await flvPageCollection.countDocuments({
            $and: [
              { rdb: new ObjectId(rdb_id) },
              { "properties.id": property_id },
              { "properties.value": data },
            ],
          });
          if (count > 1) return false;
        }
        return true;
      } else {
        return false;
      }
    }
    case "not null": {
      return false;
    }
    case "check": {
      return false;
    }
  }

  return false;
}
