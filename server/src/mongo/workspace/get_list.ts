import { flvWorkspaceCollection } from "mongo/collections/flave/workspace";
import { ObjectId } from "mongodb";

export async function getWorkspaceList(user_id?: ObjectId | string) {
  const filter: {
    owner?: ObjectId;
  } = {};
  if (user_id !== undefined) {
    filter.owner = new ObjectId(user_id);
  }

  return await flvWorkspaceCollection
    .find(filter, { projection: { name: true, owner: true, member: true } })
    .toArray();
}
