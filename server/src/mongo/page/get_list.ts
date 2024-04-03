import { flvPageCollection } from "mongo/collections/flave/page";

export async function getPageList() {
  return await flvPageCollection
    .find(
      {},
      {
        projection: {
          title: true,
          workspace: true,
          created_at: true,
          created_by: true,
          updated_at: true,
          updated_by: true,
        },
      }
    )
    .toArray();
}
