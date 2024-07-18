import { flave_var_type, validate_var } from "./var_type";

// Map<type_name, data_type>
export const flave_property_type = new Map<
  string,
  | {
      [key in string]: flave_var_type;
    }
  | "string"
  | "boolean"
>();

export function validate_property(
  type: string,
  data: object | string | boolean
): boolean {
  if (typeof data === "object") {
    const data_type = flave_property_type.get(type);
    if (data_type === undefined) return false;
    if (typeof data_type !== "object") return false;

    const target = data as { [key in string]: unknown };

    for (const [key, target_data] of Object.entries(target)) {
      const var_type = data_type[key];
      if (var_type === undefined) return false;
      if (validate_var(var_type, target_data) === false) return false;
    }
  } else {
    const data_type = flave_property_type.get(type);
    if (data_type === undefined) return false;
    if (typeof data_type === "object") return false;
    if (typeof data !== data_type) return false;
  }
  return true;
}

export function exists_property(type: string): boolean {
  return flave_property_type.has(type);
}

// text
flave_property_type.set("text", "string");

// checkbox
flave_property_type.set("checkbox", "boolean");

// relation
flave_property_type.set("relation", {
  page_list: {
    type: "array",
    children: "string",
  },
});
