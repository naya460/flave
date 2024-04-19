import { flvPageCollection } from "mongo/collections/flave/page";
import { ObjectId } from "mongodb";

export async function getPageData(page_id: string) {
  return await flvPageCollection.findOne(
    { _id: new ObjectId(page_id) },
    {
      projection: {
        parent: true,
        title: true,
      },
    }
  );
}
