export type flave_var_type =
  | string
  | {
      type: string;
      children: flave_var_type;
    };

// Map<type_name, validator>
const flave_var_type_list = new Map<
  string,
  (value: unknown, children?: flave_var_type) => boolean
>();

export function validate_var(type: flave_var_type, value: unknown): boolean {
  if (typeof type === "string") {
    const validator = flave_var_type_list.get(type);
    if (validator === undefined) return false;
    return validator(value);
  } else {
    const validator = flave_var_type_list.get(type.type);
    if (validator === undefined) return false;
    return validator(value, type.children);
  }
}

flave_var_type_list.set("string", (value) => {
  if (typeof value !== "string") return false;
  return true;
});

flave_var_type_list.set("boolean", (value) => {
  if (typeof value !== "boolean") return false;
  return true;
});

flave_var_type_list.set("number", (value) => {
  if (typeof value !== "number") return false;
  return true;
});

flave_var_type_list.set("array", (value, children_type) => {
  if (typeof value !== "object") return false;
  if (value === null) return false;
  if (Array.isArray(value) === false) return false;
  if (children_type === undefined) {
    return true;
  } else {
    const array = Object.entries(value);
    for (const i of array) {
      if (validate_var(children_type, i[1]) === false) {
        return false;
      }
    }
    return true;
  }
});
