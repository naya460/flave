import { flvWorkspaceCollection } from "mongo/collections/flave/workspace";
import { ObjectId } from "mongodb";

export async function getWorkspaceData(
  workspace_id: string,
  data: {
    filter?: undefined;
    projection?: {
      name?: boolean;
      owner?: boolean;
      member?: boolean;
    };
  } = {
    projection: {
      name: true,
    },
  }
) {
  return await flvWorkspaceCollection.findOne(
    { _id: new ObjectId(workspace_id) },
    { projection: data.projection }
  );
}
