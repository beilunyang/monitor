import { UPLOAD_URL } from './config.ignore';

export const UPLOAD_ENDPOINT = UPLOAD_URL;

// 不会记录log的url
export const WHITE_LIST = [
  UPLOAD_ENDPOINT,
];
