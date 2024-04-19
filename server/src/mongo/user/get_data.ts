import { flvUserCollection } from "mongo/collections/flave/user";
import { ObjectId } from "mongodb";

type Arg = {
  filter?: undefined;
  projection?: {
    name?: boolean;
    hash?: boolean;
    admin?: boolean;
  };
};

export async function getUserData(
  user_id: string,
  arg: Arg = {
    projection: {
      name: true,
    },
  }
) {
  return await flvUserCollection.findOne(
    { _id: new ObjectId(user_id) },
    { projection: arg.projection }
  );
}
