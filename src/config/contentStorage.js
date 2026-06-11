import { isFirebaseConfigured } from '../firebase/client';

/**
 * @returns {'firestore'|'local'|'http'}
 */
export function getContentStorageMode() {
  if (
    process.env.REACT_APP_CONTENT_USE_FIRESTORE === 'true' &&
    isFirebaseConfigured()
  ) {
    return 'firestore';
  }
  if (process.env.REACT_APP_CONTENT_USE_LOCAL_STORE !== 'false') {
    return 'local';
  }
  return 'http';
}

export function isFirestoreStorage() {
  return getContentStorageMode() === 'firestore';
}
