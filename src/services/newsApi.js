import { getContentStorageMode } from '../config/contentStorage';
import { ContentConflictError, isContentConflictError } from './contentConflict';
import {
  listArticlesFirestore,
  getArticleBySlugFirestore,
  upsertArticleFirestore,
  deleteArticleFirestore,
  listAuthorsFirestore,
  upsertAuthorFirestore,
  deleteAuthorFirestore,
  listTagsFirestore,
  upsertTagFirestore,
  deleteTagFirestore,
} from './newsFirestoreStore';
import {
  listArticlesLocal,
  getArticleBySlugLocal,
  upsertArticleLocal,
  deleteArticleLocal,
  listAuthorsLocal,
  upsertAuthorLocal,
  deleteAuthorLocal,
  listTagsLocal,
  upsertTagLocal,
  deleteTagLocal,
} from './newsLocalStore';
import { normalizeArticle } from './newsNormalizer';

function mode() {
  const m = getContentStorageMode();
  return m === 'firestore' ? 'firestore' : 'local';
}

export async function listArticles(options = {}) {
  if (mode() === 'firestore') return listArticlesFirestore(options);
  return listArticlesLocal(options);
}

export async function getArticleBySlug(slug, options = {}) {
  if (mode() === 'firestore') return getArticleBySlugFirestore(slug, options);
  return getArticleBySlugLocal(slug, options);
}

export async function saveArticle(article, saveOptions = {}) {
  const payload = normalizeArticle(article);
  if (mode() === 'firestore') return upsertArticleFirestore(payload, saveOptions);
  return upsertArticleLocal(payload);
}

export async function deleteArticle(slug) {
  if (mode() === 'firestore') return deleteArticleFirestore(slug);
  return deleteArticleLocal(slug);
}

export async function listAuthors() {
  if (mode() === 'firestore') return listAuthorsFirestore();
  return listAuthorsLocal();
}

export async function saveAuthor(author) {
  if (mode() === 'firestore') return upsertAuthorFirestore(author);
  return upsertAuthorLocal(author);
}

export async function deleteAuthor(id) {
  if (mode() === 'firestore') return deleteAuthorFirestore(id);
  return deleteAuthorLocal(id);
}

export async function listTags() {
  if (mode() === 'firestore') return listTagsFirestore();
  return listTagsLocal();
}

export async function saveTag(tag) {
  if (mode() === 'firestore') return upsertTagFirestore(tag);
  return upsertTagLocal(tag);
}

export async function deleteTag(id) {
  if (mode() === 'firestore') return deleteTagFirestore(id);
  return deleteTagLocal(id);
}

export { ContentConflictError, isContentConflictError };
