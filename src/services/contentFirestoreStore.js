/**

 * Conteúdo institucional no Cloud Firestore (produção compartilhada).

 */

import {

  collection,

  doc,

  getDoc,

  getDocs,

  deleteDoc,

  serverTimestamp,

  runTransaction,

} from 'firebase/firestore';

import { getDb } from '../firebase/client';

import { normalizePage } from './contentNormalizer';

import { CONTENT_SEEDS, CONTENT_SEEDS_BY_SLUG } from '../data/contentSeeds';

import { CONTENT_STORE_UPDATED_EVENT } from './contentLocalStore';

import { sanitizeForFirestore } from '../utils/firestoreSanitize';
import { ContentConflictError } from './contentConflict';



const COLLECTION = 'pages';



function notifyUpdated() {

  if (typeof window === 'undefined') return;

  window.dispatchEvent(new CustomEvent(CONTENT_STORE_UPDATED_EVENT));

}



function getDbOrThrow() {

  const db = getDb();

  if (!db) throw new Error('Firestore não configurado. Verifique REACT_APP_FIREBASE_* no .env');

  return db;

}



/**

 * @param {import('firebase/firestore').DocumentData} data

 * @param {string} slug

 */

function docToPage(data, slug) {

  return normalizePage({

    ...data,

    id: data.id || slug,

    slug: data.slug || slug,

    contentRevision:
      typeof data.contentRevision === 'number' ? data.contentRevision : 0,

  });

}



/**

 * @param {import('./contentNormalizer').ContentPage} page

 */

function pageHasRenderableContent(page) {

  const walk = (sections) => {

    for (const section of sections || []) {

      if ((section.blocks || []).some((b) => b?.type)) return true;

      if (walk(section.children)) return true;

    }

    return false;

  };

  return walk(page.sections);

}



/**

 * @param {import('./contentNormalizer').ContentPage} page

 */

function pageToFirestore(page) {

  const normalized = normalizePage(page);

  const payload = {

    id: normalized.id || normalized.slug,

    slug: normalized.slug,

    title: normalized.title,

    subtitle: normalized.subtitle || '',

    parallaxImage: normalized.parallaxImage || '',

    status: normalized.status || 'draft',

    position: normalized.position ?? 0,

    sections: normalized.sections,

    updatedAt: serverTimestamp(),

    lastEditedBy: page.lastEditedBy || '',

    lastEditedByEmail: page.lastEditedByEmail || '',

    lastEditedAt: serverTimestamp(),

  };

  return /** @type {import('firebase/firestore').DocumentData} */ (

    sanitizeForFirestore(payload)

  );

}



/**

 * @param {string} slug

 */

function getBundledSeedPage(slug) {

  const seed = CONTENT_SEEDS_BY_SLUG[slug];

  if (!seed) return null;

  return normalizePage({

    ...seed,

    id: seed.id || `seed-${slug}`,

    status: seed.status || 'published',

  });

}



/**

 * @returns {Promise<import('./contentNormalizer').ContentPage[]>}

 */

export async function listPagesFirestore() {

  const db = getDbOrThrow();

  const snap = await getDocs(collection(db, COLLECTION));

  const pages = snap.docs.map((d) => docToPage(d.data(), d.id));

  return pages.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

}



/**

 * @param {string} slug

 * @param {{ publicOnly?: boolean }} [options]

 */

export async function getPageBySlugFirestore(slug, options = {}) {

  const { publicOnly = false } = options;

  const db = getDbOrThrow();

  const ref = doc(db, COLLECTION, slug);

  const snap = await getDoc(ref);



  if (snap.exists()) {

    const page = docToPage(snap.data(), snap.id);

    const emptyDoc = !pageHasRenderableContent(page);



    if (publicOnly) {

      if (page.status !== 'published' || emptyDoc) {

        return getBundledSeedPage(slug);

      }

    }



    return page;

  }



  if (publicOnly) {

    return getBundledSeedPage(slug);

  }



  return null;

}



/**

 * @param {import('./contentNormalizer').ContentPage} page

 * @param {{ merge?: boolean, expectedRevision?: number, forceOverwrite?: boolean }} [options]

 */

export async function upsertPageFirestore(page, options = {}) {

  const { merge = true, expectedRevision, forceOverwrite = false } = options;

  const db = getDbOrThrow();

  const normalized = normalizePage(page);

  const slug = normalized.slug;

  const ref = doc(db, COLLECTION, slug);

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

          currentData ? docToPage(currentData, slug) : null

        );

      }

    }

    const newRev = currentRev + 1;

    const payload = pageToFirestore(normalized);

    payload.contentRevision = newRev;

    transaction.set(ref, payload, { merge });

  });

  notifyUpdated();

  return getPageBySlugFirestore(slug);

}



/**

 * @param {string} idOrSlug

 */

export async function deletePageFirestore(idOrSlug) {

  const db = getDbOrThrow();

  const pages = await listPagesFirestore();

  const match = pages.find((p) => p.slug === idOrSlug || p.id === idOrSlug);

  if (!match) return false;

  await deleteDoc(doc(db, COLLECTION, match.slug));

  notifyUpdated();

  return true;

}



/**

 * Publica seeds iniciais no Firestore (uso único / restaurar).

 */

export async function seedFirestoreFromSeeds() {

  const results = [];

  for (const seed of CONTENT_SEEDS) {

    const saved = await upsertPageFirestore(

      {

        ...seed,

        id: seed.id || `seed-${seed.slug}`,

        status: seed.status || 'published',

      },

      { merge: false, forceOverwrite: true }

    );

    results.push(saved);

  }

  return results;

}


