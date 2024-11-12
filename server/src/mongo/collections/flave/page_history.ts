import { mongoClient } from "lib/mongo";
import { ObjectId } from "mongodb";

export type UpdateData =
  | {
      type: "create_block";
      data: {
        block_id: ObjectId;
        next_of: ObjectId | null;
        type: string;
        data: unknown;
      };
    }
  | {
      type: "delete_block";
      data: {
        block_id: ObjectId;
      };
    }
  | {
      type: "edit_block";
      data: {
        block_id: ObjectId;
        next_of?: ObjectId | null;
        data?: unknown;
      };
    }
  | {
      type: "create_page";
      data: {
        workspace_id: ObjectId;
        parent?: ObjectId;
        rdb_id?: ObjectId;
      };
    }
  | {
      type: "delete_page";
    }
  | {
      type: "recover_page";
    }
  | {
      type: "edit_page_constraint";
      data: {
        constraint: {
          id: string;
          result: boolean;
        };
      };
    }
  | {
      type: "edit_page_property";
      data: {
        property: {
          id: string;
          value: object | string | boolean;
        };
      };
    }
  | {
      type: "edit_page_data";
      data: {
        title: string;
      };
    };

type flvPageHistoryType = {
  page_id: ObjectId;
  update_data: UpdateData;
  edited_at: Date;
  edited_by: ObjectId;
};

export const flvPageHistoryCollection = mongoClient
  .db("flave")
  .collection<flvPageHistoryType>("page_history");
