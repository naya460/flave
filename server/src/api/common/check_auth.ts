import { FastifyReply, FastifyRequest } from "fastify";
import { getBlockData } from "mongo/block/get_data";
import { getPageData } from "mongo/page/get_data";
import { getRdbData } from "mongo/rdb/get_data";
import { getSessionData } from "mongo/session/get_data";
import { getUserData } from "mongo/user/get_data";
import { getWorkspaceData } from "mongo/workspace/get_data";
import { ObjectId } from "mongodb";

type Auth =
  | "auth"
  | "admin"
  | { workspace: string }
  | { page: string }
  | { block: string }
  | { rdb: string };

export const checkAuth = async (
  type: Auth,
  req: FastifyRequest,
  res?: FastifyReply
) => {
  // get user session cookie
  const session = req.cookies.session;
  if (session === undefined) {
    res?.status(401);
    return null;
  }

  // get user id
  const user_id = (await getSessionData(session))?.user_id;
  if (user_id === undefined) {
    res?.status(400);
    return null;
  }

  // especially type is "admin"
  if (type === "admin") {
    const user_data = await getUserData(user_id.toString(), {
      projection: { admin: true },
    });
    const is_admin = user_data?.admin === true;

    if (is_admin === false) {
      res?.status(403);
      return null;
    }
  }
  // especially type is "workspace"
  else if (typeof type === "object" && "workspace" in type) {
    const member = await getWorkspaceData(type.workspace, {
      projection: { owner: true, member: true },
    });

    if (member === null) {
      res?.status(400);
      return null;
    }

    if (
      member.owner.equals(user_id) === false &&
      member.member.some((v) => v.user_id.equals(user_id)) === false
    ) {
      res?.status(403);
      return null;
    }
  }
  // especially type is "page"
  else if (typeof type === "object" && "page" in type) {
    const page = await getPageData(type.page, {
      projection: { workspace: true },
    });

    if (page === null) {
      res?.status(400);
      return null;
    }

    const member = await getWorkspaceData(page.workspace.toString(), {
      projection: { owner: true, member: true },
    });

    if (member === null) {
      res?.status(400);
      return null;
    }

    if (
      member.owner.equals(user_id) === false &&
      member.member.some((v) => v.user_id.equals(user_id)) === false
    ) {
      res?.status(403);
      return null;
    }
  }
  // especially type is "block"
  else if (typeof type === "object" && "block" in type) {
    const block = await getBlockData(type.block);

    if (block === null) {
      res?.status(400);
      return null;
    }

    const page = await getPageData(block.page.toString(), {
      projection: { workspace: true },
    });

    if (page === null) {
      res?.status(400);
      return null;
    }

    const member = await getWorkspaceData(page.workspace.toString(), {
      projection: { owner: true, member: true },
    });

    if (member === null) {
      res?.status(400);
      return null;
    }

    if (
      member.owner.equals(user_id) === false &&
      member.member.some((v) => v.user_id.equals(user_id)) === false
    ) {
      res?.status(403);
      return null;
    }
  }
  // especially type is "rdb"
  else if (typeof type === "object" && "rdb" in type) {
    const rdb = await getRdbData(new ObjectId(type.rdb));

    if (rdb === null) {
      res?.status(400);
      return null;
    }

    const member = await getWorkspaceData(rdb.workspace.toString(), {
      projection: { owner: true, member: true },
    });

    if (member === null) {
      res?.status(400);
      return null;
    }

    if (
      member.owner.equals(user_id) === false &&
      member.member.some((v) => v.user_id.equals(user_id)) === false
    ) {
      res?.status(403);
      return null;
    }
  }

  // when satisfy auth conditions, return user id
  return user_id;
};
