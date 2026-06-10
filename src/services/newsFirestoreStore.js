import {
  collection,
  doc,
  getDoc,
  getDocs,
  deleteDoc,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore';
import { getDb } from '../firebase/client';
import { sanitizeForFirestore } from '../utils/firestoreSanitize';
import { ContentConflictError } from './contentConflict';
import {
  normalizeArticle,
  normalizeAuthor,
  normalizeTag,
} from './newsNormalizer';

const ARTICLES = 'articles';
const AUTHORS = 'articleAuthors';
const TAGS = 'articleTags';

function getDbOrThrow() {
  const db = getDb();
  if (!db) throw new Error('Firestore não configurado.');
  return db;
}

function docToArticle(data, slug) {
  return normalizeArticle({ ...data, id: data.id || slug, slug: data.slug || slug });
}

function articleToFirestore(article) {
  const n = normalizeArticle(article);
  return sanitizeForFirestore({
    id: n.id || n.slug,
    slug: n.slug,
    type: n.type,
    title: n.title,
    excerpt: n.excerpt || '',
    coverImage: n.coverImage || '',
    blocks: n.blocks,
    publishedAt: n.publishedAt,
    status: n.status,
    authorId: n.authorId || '',
    tagIds: n.tagIds || [],
    eventDate: n.eventDate || '',
    eventLocation: n.eventLocation || '',
    lastEditedBy: article.lastEditedBy || '',
    lastEditedByEmail: article.lastEditedByEmail || '',
    lastEditedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function listArticlesFirestore(options = {}) {
  const { publicOnly = false, type, tagId } = options;
  const db = getDbOrThrow();
  const snap = await getDocs(collection(db, ARTICLES));
  let items = snap.docs.map((d) => docToArticle(d.data(), d.id));

  if (publicOnly) {
    items = items.filter((a) => a.status === 'published');
  }
  if (type) {
    items = items.filter((a) => a.type === type);
  }
  if (tagId) {
    items = items.filter((a) => (a.tagIds || []).includes(tagId));
  }

  return items.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export async function getArticleBySlugFirestore(slug, options = {}) {
  const { publicOnly = false } = options;
  const db = getDbOrThrow();
  const ref = doc(db, ARTICLES, slug);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const article = docToArticle(snap.data(), snap.id);
  if (publicOnly && article.status !== 'published') return null;
  return article;
}

export async function upsertArticleFirestore(article, options = {}) {
  const { expectedRevision, forceOverwrite = false } = options;
  const db = getDbOrThrow();
  const normalized = normalizeArticle(article);
  const slug = normalized.slug;
  const ref = doc(db, ARTICLES, slug);

  await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(ref);
    const currentData = snap.exists() ? snap.data() : null;
    const currentRev =
      currentData && typeof currentData.contentRevision === 'number'
        ? currentData.contentRevision
        : 0;

    if (!forceOverwrite && expectedRevision !== undefined) {
      const expected =
        typeof expectedRevision === 'number' && !Number.isNaN(expectedRevision)
          ? expectedRevision
          : 0;
      if (!snap.exists() && expected > 0) {
        throw new ContentConflictError(null);
      }
      if (snap.exists() && currentRev !== expected) {
        throw new ContentConflictError(
          currentData ? docToArticle(currentData, slug) : null
        );
      }
    }

    const payload = articleToFirestore(normalized);
    payload.contentRevision = currentRev + 1;
    transaction.set(ref, payload, { merge: true });
  });

  return getArticleBySlugFirestore(slug);
}

export async function deleteArticleFirestore(slug) {
  const db = getDbOrThrow();
  await deleteDoc(doc(db, ARTICLES, slug));
  return true;
}

export async function listAuthorsFirestore() {
  const db = getDbOrThrow();
  const snap = await getDocs(collection(db, AUTHORS));
  return snap.docs
    .map((d) => normalizeAuthor({ ...d.data(), id: d.id }))
    .filter((a) => a.name)
    .sort(
      (a, b) =>
        (a.position ?? 0) - (b.position ?? 0) ||
        String(a.name || '').localeCompare(String(b.name || ''))
    );
}

export async function upsertAuthorFirestore(author) {
  const db = getDbOrThrow();
  const normalized = normalizeAuthor(author);
  const ref = doc(db, AUTHORS, normalized.id);
  await runTransaction(db, async (t) => {
    t.set(ref, sanitizeForFirestore(normalized), { merge: true });
  });
  const snap = await getDoc(ref);
  return normalizeAuthor({ ...snap.data(), id: snap.id });
}

export async function deleteAuthorFirestore(id) {
  const db = getDbOrThrow();
  await deleteDoc(doc(db, AUTHORS, id));
  return true;
}

export async function listTagsFirestore() {
  const db = getDbOrThrow();
  const snap = await getDocs(collection(db, TAGS));
  return snap.docs
    .map((d) => normalizeTag({ ...d.data(), id: d.id }))
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0) || a.name.localeCompare(b.name));
}

export async function upsertTagFirestore(tag) {
  const db = getDbOrThrow();
  const normalized = normalizeTag(tag);
  const ref = doc(db, TAGS, normalized.id);
  await runTransaction(db, async (t) => {
    t.set(ref, sanitizeForFirestore(normalized), { merge: true });
  });
  const snap = await getDoc(ref);
  return normalizeTag({ ...snap.data(), id: snap.id });
}

export async function deleteTagFirestore(id) {
  const db = getDbOrThrow();
  await deleteDoc(doc(db, TAGS, id));
  return true;
}
