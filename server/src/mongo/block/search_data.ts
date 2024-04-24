import { flvBlockCollection } from "mongo/collections/flave/block";
import { ObjectId } from "mongodb";

export async function searchBlockData(filter: { next_of: ObjectId }) {
  return await flvBlockCollection.findOne({ next_of: filter.next_of }, {});
}
