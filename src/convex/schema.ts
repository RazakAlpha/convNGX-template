import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.string(),
    role: v.union(v.literal('user'), v.literal('guest')),
    isActive: v.boolean(),
    lastLogin: v.optional(v.number()),
  })
    .index('by_email', ['email'])
    .index('by_role', ['role'])
    .index('by_isActive', ['isActive']),
  messages: defineTable({
    userId: v.id('users'),
    content: v.string(),
    createdAt: v.number(),
  })
    .index('by_createdAt', ['createdAt'])
    .searchIndex('search_content', { searchField: 'content' }),
});
