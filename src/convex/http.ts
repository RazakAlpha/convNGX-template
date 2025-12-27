import { httpRouter } from 'convex/server';

import { betterAuthComponent } from './auth';
import { createAuth } from '../lib/auth';

const http = httpRouter();

// { cors: true } is required for client side frameworks
const allowedOrigins =
  process.env['NODE_ENV'] === 'production'
    ? ['https://tabswayapp.onrender.com', 'https://app.tabswaykitchen.com']
    : ['http://localhost:4200', 'http://localhost:5173'];

// { cors: true } is required for client side frameworks
betterAuthComponent.registerRoutes(http, createAuth, {
  cors: { allowedOrigins },
});

export default http;
