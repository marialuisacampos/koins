import { FastifyInstance } from "fastify";
import { connectionController } from "@/controllers/connection.controller";
import { auth } from "@/middleware/auth";

export async function connectionRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/",
    { preHandler: [auth] },
    connectionController.getConnectionState
  );

  fastify.post("/", { preHandler: [auth] }, connectionController.sendInvite);

  fastify.patch(
    "/:id/accept",
    { preHandler: [auth] },
    connectionController.acceptConnection
  );

  fastify.patch(
    "/:id/reject",
    { preHandler: [auth] },
    connectionController.rejectConnection
  );

  fastify.delete(
    "/:id",
    { preHandler: [auth] },
    connectionController.cancelInvite
  );
}
