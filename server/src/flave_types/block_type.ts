import { validate_var, type flave_var_type } from "./var_type";

// Map<type name, data type>
export const flave_block_type = new Map<
  string,
  {
    [key in string]: flave_var_type;
  }
>();

export function validate_block(
  type: string,
  data: object,
  completely = true
): boolean {
  const target = data as { [key in string]: unknown };

  const block_data_type = flave_block_type.get(type);
  if (block_data_type === undefined) return false;

  if (completely === true) {
    if (Object.keys(block_data_type).length !== Object.keys(target).length) {
      return false;
    }

    for (const [key, var_type] of Object.entries(block_data_type)) {
      if (key in target === false) return false;
      if (validate_var(var_type, target[key]) === false) return false;
    }
  } else {
    for (const [key, target_data] of Object.entries(target)) {
      const var_type = block_data_type[key];
      if (var_type === undefined) return false;
      if (validate_var(var_type, target_data) === false) return false;
    }
  }

  return true;
}

// paragraph
flave_block_type.set("paragraph", {
  text: "string",
});

// rdb_view
flave_block_type.set("rdb_view", {
  rdb_id: "string",
  display: {
    type: "array",
    children: "string",
  },
});

// heading
flave_block_type.set("heading", {
  ...flave_block_type.get("paragraph"),
  level: "number",
});

// list
flave_block_type.set("bullet_list", {
  ...flave_block_type.get("paragraph"),
});

// file
flave_block_type.set("file", {
  file_id: "string",
});
