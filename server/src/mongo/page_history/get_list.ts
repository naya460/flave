import { flvPageHistoryCollection } from "mongo/collections/flave/page_history";
import { ObjectId } from "mongodb";

export async function getPageHistoryList(page_id: ObjectId) {
  return await flvPageHistoryCollection.find({ page_id }).toArray();
}
