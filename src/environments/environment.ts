// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  // production: false,
  // baseURL: 'http://api-dev.gojaro.com/rest/jaro-dev/',
  // googleMapApiKey: 'AIzaSyBHAFvD1hwJTWvFqjKzqIxzydq5D1Ksf4I',
  // logoImgPath: 'http://test.gojaro.com/logos/',
  // masterClientId: '95',
  // masterPersonId: '101323'

  production: true,
  baseURL: 'http://api.gojaro.com/rest/jaro/',
  googleMapApiKey: 'AIzaSyB_4M5xwXfU1UhdC2Ur-C52C3U0e65hOGs',
  logoImgPath: 'http://database.gojaro.com/logos/',
  masterClientId: '8039',
  masterPersonId: '289252',
  liveScoringEnable: false,
  showMoreTab: false, // true only for HZSA
  appName: 'com.gojaro.igssasa',
  appVersion: '1.0.0',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
