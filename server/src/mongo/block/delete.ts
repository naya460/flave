import { flvBlockCollection } from "mongo/collections/flave/block";
import { ObjectId } from "mongodb";

export const deleteBlock = async (block_id: string) => {
  console.log(block_id);
  const result = await flvBlockCollection.findOneAndDelete({
    _id: new ObjectId(block_id),
  });

  if (result !== null) {
    await flvBlockCollection.updateOne(
      { page: result.page, next_of: result._id },
      { $set: { next_of: result.next_of } }
    );
  }

  return result !== null;
};
