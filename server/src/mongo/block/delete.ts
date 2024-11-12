import { flvBlockCollection } from "mongo/collections/flave/block";
import { createPageHistory } from "mongo/page_history/create";
import { ObjectId } from "mongodb";

export const deleteBlock = async (block_id: string, user_id: ObjectId) => {
  const result = await flvBlockCollection.findOneAndDelete({
    _id: new ObjectId(block_id),
  });

  if (result !== null) {
    const tmp = await flvBlockCollection.updateOne(
      { page: result.page, next_of: result._id },
      { $set: { next_of: result.next_of } }
    );

    createPageHistory(
      result.page,
      {
        type: "delete_block",
        data: {
          block_id: new ObjectId(block_id),
        },
      },
      user_id
    );

    if (tmp.upsertedId !== null) {
      createPageHistory(
        result.page,
        {
          type: "edit_block",
          data: {
            block_id: tmp.upsertedId,
            next_of: result.next_of,
          },
        },
        user_id
      );
    }
  }

  return result !== null;
};
