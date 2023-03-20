// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // in dev environment I want to use the live angular and live server, so this can be disjoint
  // api_url: 'http://localhost:5000/misinfo/api',
  // credibility_url: 'http://localhost:5000/misinfo/api/credibility',
  api_url: 'https://misinfo.me/misinfo/api',
  credibility_url: 'https://misinfo.me/misinfo/api/credibility'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
