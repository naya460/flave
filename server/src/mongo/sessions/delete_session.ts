import { flvSessionCollection } from "mongo/collections/flave/session";

export const deleteSession = async (session_id: string) => {
  const result = await flvSessionCollection.deleteOne({
    session_id,
  });

  return result.acknowledged;
};
