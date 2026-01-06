import { v } from 'convex/values';
import { query, mutation } from './_generated/server';
import { Id } from './_generated/dataModel';
import { betterAuthComponent } from './auth';

export const updateUserProfile = mutation({
  args: {
    name: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = (await betterAuthComponent.getAuthUserId(ctx)) as Id<'users'>;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const updateData: { name?: string } = {};
    if (args.name !== undefined) {
      updateData.name = args.name;
    }

    await ctx.db.patch(userId, updateData);

    return null;
  },
});
