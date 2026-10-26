import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

function generateSlug(): string {
  return Math.random().toString(36).substring(2, 8);
}

export const linkRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ url: z.string().url("Must be a valid URL") }))
    .mutation(async ({ ctx, input }) => {
      const slug = generateSlug();
      return ctx.db.link.create({
        data: { slug, url: input.url },
      });
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.link.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    });
  }),
});
