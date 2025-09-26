export const environment = {
  convexUrl: 'https://descriptive-bulldog-9.convex.cloud',
  authBaseURL: 'https://descriptive-bulldog-9.convex.site',
  siteUrl: 'http://localhost:4200',
  authSkewMs: 45000 as number, // optional skew before JWT expiry to refresh
  keep: 'last' as 'last' | 'none', // default keep mode for live resources
};
