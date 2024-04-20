import { flvPageCollection } from "mongo/collections/flave/page";
import { ObjectId } from "mongodb";

type Condition = {
  projection?: {
    title?: boolean;
    workspace?: boolean;
    parent?: boolean;
  };
};

export async function getPageData(
  page_id: string,
  condition: Condition = {
    projection: {
      parent: true,
      title: true,
    },
  }
) {
  return await flvPageCollection.findOne(
    { _id: new ObjectId(page_id) },
    { projection: condition.projection }
  );
}
