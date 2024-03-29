import { flvWorkspaceCollection } from "mongo/collections/flave/workspace";
import { ObjectId } from "mongodb";

export async function getWorkspaceList(user_id?: ObjectId) {
  const filter: {
    owner?: ObjectId;
  } = {};
  if (user_id !== undefined) {
    filter.owner = user_id;
  }

  return await flvWorkspaceCollection
    .find(filter, { projection: { name: true, owner: true, member: true } })
    .toArray();
}
