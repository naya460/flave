import type { PageType } from "../../rdb_page_list";

export function checkEqual(
  resources: PageType,
  join_resources: PageType,
  property_id1: string,
  property_id2: string,
) {
  const property1 = (() => {
    if (join_resources.properties.some(v => v.id === property_id1)) {
      return join_resources.properties.find(v => v.id === property_id1);
    } else if (resources.properties.some(v => v.id === property_id1)) {
      return resources.properties.find(v => v.id === property_id1);
    } else {
      return undefined;
    }
  })();

  const property2 = (() => {
    if (join_resources.properties.some(v => v.id === property_id2)) {
      return join_resources.properties.find(v => v.id === property_id2);
    } else if (resources.properties.some(v => v.id === property_id2)) {
      return resources.properties.find(v => v.id === property_id2);
    } else {
      return undefined;
    }
  })();

  if (property1 === undefined || property2 === undefined) {
    return false;
  }

  return property1.value === property2.value;
}
