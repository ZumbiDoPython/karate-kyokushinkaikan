/**
 * Envia seeds institucionais ao Firestore (credenciais do firebase login).
 */
const Configstore = require('configstore');
const { Firestore } = require('@google-cloud/firestore');
const path = require('path');

const PROJECT_ID = 'kyokushinkaikan-brasil';
const CLIENT_ID = '563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com';
const CLIENT_SECRET = 'j9iVZfS8kkCEFUPaAeJV0sAi';

function sanitizeForFirestore(value) {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (Array.isArray(value)) {
    return value.map(sanitizeForFirestore).filter((item) => item !== undefined);
  }
  if (typeof value === 'object') {
    const out = {};
    Object.entries(value).forEach(([key, val]) => {
      if (val === undefined) return;
      const cleaned = sanitizeForFirestore(val);
      if (cleaned !== undefined) out[key] = cleaned;
    });
    return out;
  }
  return value;
}

function pageToFirestoreDoc(seed) {
  return sanitizeForFirestore({
    id: seed.id || `seed-${seed.slug}`,
    slug: seed.slug,
    title: seed.title || seed.slug,
    subtitle: seed.subtitle || '',
    parallaxImage: seed.parallaxImage || '',
    status: seed.status || 'published',
    position: seed.position ?? 0,
    sections: seed.sections || [],
    updatedAt: Firestore.FieldValue.serverTimestamp(),
  });
}

function getFirebaseCliTokens() {
  const store = new Configstore('firebase-tools');
  const tokens = store.get('tokens');
  if (!tokens?.refresh_token) {
    throw new Error('Execute "firebase login" antes de rodar npm run seed:firestore');
  }
  return tokens.refresh_token;
}

async function main() {
  const refreshToken = getFirebaseCliTokens();

  const db = new Firestore({
    projectId: PROJECT_ID,
    credentials: {
      type: 'authorized_user',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: refreshToken,
    },
  });

  const seedsDir = path.join(__dirname, '..', 'src', 'data', 'contentSeeds');
  const kyokushinkaikan = require(path.join(seedsDir, 'kyokushinkaikan.json'));

  for (const seed of [kyokushinkaikan]) {
    await db.collection('pages').doc(seed.slug).set(pageToFirestoreDoc(seed));
    console.log(`OK: pages/${seed.slug} (${(seed.sections || []).length} seções raiz)`);
  }

  console.log('Seed Firestore concluído.');
}

main().catch((err) => {
  console.error('Falha no seed:', err.message || err);
  process.exit(1);
});
