import { flvBlockCollection } from "mongo/collections/flave/block";
import { createPageHistory } from "mongo/page_history/create";
import { ObjectId } from "mongodb";

export async function updateBlock(
  block_id: string,
  user_id: ObjectId,
  data: {
    next_of?: ObjectId | null;
  } & {
    [key in `data.${string}`]: unknown;
  }
) {
  const target = await flvBlockCollection.findOneAndUpdate(
    { _id: new ObjectId(block_id) },
    {
      $set: {
        ...data,
        updated_at: new Date(),
        updated_by: user_id,
      },
    }
  );

  if (target !== null) {
    const tmp_data = Object.entries(data).filter(([key]) =>
      key.startsWith("data.")
    );
    if (tmp_data.length !== 0) {
      for (const v of tmp_data) {
        createPageHistory(
          target.page,
          {
            type: "edit_block",
            data: {
              block_id: new ObjectId(block_id),
              data: {
                [v[0].slice(5)]: v[1],
              },
            },
          },
          user_id
        );
      }
    }

    if (data.next_of !== undefined) {
      // Reconnect the extracted locations
      const tmp1 = await flvBlockCollection.updateOne(
        { page: target.page, next_of: new ObjectId(block_id) },
        { $set: { next_of: target.next_of } }
      );

      // Reconnect the inserted locations
      const tmp2 = await flvBlockCollection.updateOne(
        {
          $and: [
            { page: target.page },
            { next_of: data.next_of },
            { _id: { $ne: new ObjectId(block_id) } },
          ],
        },
        { $set: { next_of: new ObjectId(block_id) } }
      );

      if (tmp1.upsertedId !== null) {
        createPageHistory(
          target.page,
          {
            type: "edit_block",
            data: {
              block_id: tmp1.upsertedId,
              next_of: target.next_of,
            },
          },
          user_id
        );
      }

      if (tmp2.upsertedId !== null) {
        createPageHistory(
          target.page,
          {
            type: "edit_block",
            data: {
              block_id: tmp2.upsertedId,
              next_of: new ObjectId(block_id),
            },
          },
          user_id
        );
      }
    }
  }

  return target !== null;
}
