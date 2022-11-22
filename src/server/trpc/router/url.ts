import { TRPCError } from "@trpc/server";
import { urlInputSchema } from "../../../utils/validation";
import { t } from "../trpc";

const userMiddleware = t.middleware(async ({ ctx, next }) => {
  const unauthorizedError = new TRPCError({ code: "UNAUTHORIZED" });

  if (!ctx.userId) {
    throw unauthorizedError;
  }

  const user = await ctx.prisma.user.findUnique({
    where: { id: ctx.userId },
    select: { id: true },
  });

  if (!user) {
    throw unauthorizedError;
  }

  return next({ ctx: { user } });
});

export const urlRouter = t.router({
  create: t.procedure
    .use(userMiddleware)
    .input(urlInputSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const url = await ctx.prisma.url.create({
          data: {
            sourceUrl: input.url,
            userId: ctx.user.id,
            name: input.name,
          },
        });

        return url;
      } catch (e) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "This name is already registered",
          cause: "name",
        });
      }
    }),
  getAll: t.procedure.use(userMiddleware).query(async ({ ctx }) => {
    const urls = await ctx.prisma.url.findMany();
    return urls;
  }),
});
