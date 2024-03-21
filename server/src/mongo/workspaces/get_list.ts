import { flvWorkspaceCollection } from "mongo/collections/flave/workspace";

export async function getWorkspaceList() {
  return await flvWorkspaceCollection
    .find({}, { projection: { name: true, owner: true, member: true } })
    .toArray();
}
