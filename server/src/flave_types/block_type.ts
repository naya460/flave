// Map<type name, data type>
export const flave_block_type = new Map<
  string,
  {
    [key in string]:
      | string
      | string[]
      | ((key: string, target: { [key in string]: unknown }) => boolean);
  }
>();

export function validate_block(type: string, data: object): boolean {
  const target = data as { [key in string]: unknown };

  const block_data_type = flave_block_type.get(type);
  if (block_data_type === undefined) return false;

  if (Object.keys(block_data_type).length !== Object.keys(target).length)
    return false;

  for (const [key, value] of Object.entries(block_data_type)) {
    if (key in target === false) return false;

    if (typeof value === "string") {
      if (typeof target[key] !== value) return false;
    } else if (typeof value === "function") {
      const judgement = value(key, target);
      if (judgement === false) return false;
    } else {
      if (value.some((v) => typeof target[key] === v) === false) return false;
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
  display: (key, target) => {
    if (typeof target[key] !== "object") return false;
    if (Array.isArray(target[key]) === false) return false;
    return true;
  },
});

// heading
flave_block_type.set("heading", {
  ...flave_block_type.get("paragraph"),
  level: "number",
});
