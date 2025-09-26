import { environment } from '../environments/environment';

export default {
  providers: [
    {
      // Your Convex site URL is provided in a system
      // environment variable
      // @ts-ignore
      domain: environment.authBaseURL,

      // Application ID has to be "convex"
      applicationID: 'convex',
    },
  ],
};
