import { flvWorkspaceCollection } from "mongo/collections/flave/workspace";
import { ObjectId } from "mongodb";

export async function getWorkspaceData(workspace_id: string) {
  return await flvWorkspaceCollection.findOne(
    { _id: new ObjectId(workspace_id) },
    { projection: { name: true } }
  );
}
