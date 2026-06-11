const PROJECT_REF =
  process.env.REACT_APP_SUPABASE_PROJECT_REF || 'mbfrccetbupdaptoptsm';
const SUPABASE_URL =
  process.env.REACT_APP_SUPABASE_URL || `https://${PROJECT_REF}.supabase.co`;
const BUCKET = process.env.REACT_APP_SUPABASE_STORAGE_BUCKET || 'wkk-bucket';
const ACCESS_KEY = process.env.REACT_APP_SUPABASE_S3_ACCESS_KEY_ID;
const SECRET_KEY = process.env.REACT_APP_SUPABASE_S3_SECRET_ACCESS_KEY;
const S3_REGION = process.env.REACT_APP_SUPABASE_S3_REGION || 'us-east-1';

/** @type {import('@aws-sdk/client-s3').S3Client|null} */
let s3Client = null;

async function getS3Client() {
  if (!ACCESS_KEY || !SECRET_KEY) return null;
  if (!s3Client) {
    const { S3Client } = await import('@aws-sdk/client-s3');
    s3Client = new S3Client({
      forcePathStyle: true,
      region: S3_REGION,
      endpoint: `https://${PROJECT_REF}.storage.supabase.co/storage/v1/s3`,
      credentials: {
        accessKeyId: ACCESS_KEY,
        secretAccessKey: SECRET_KEY,
      },
    });
  }
  return s3Client;
}

/**
 * @param {File|Blob|null|undefined} file
 */
export function isImageFile(file) {
  if (!file) return false;
  if (file.type?.startsWith('image/')) return true;
  return /\.(jpe?g|png|gif|webp|bmp|heic|heif|avif)$/i.test(file.name || '');
}

export function isSupabaseStorageConfigured() {
  return Boolean(ACCESS_KEY && SECRET_KEY);
}

/**
 * @param {string} objectKey
 */
export function getSupabasePublicUrl(objectKey) {
  const key = String(objectKey || '').replace(/^\//, '');
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${key}`;
}

/**
 * @param {string} name
 */
function sanitizeFileName(name) {
  return (name || 'imagem')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
    .slice(0, 80);
}

/**
 * @param {File} file
 * @param {{ folder?: string }} [options]
 * @returns {Promise<{ url: string, path: string }>}
 */
export async function uploadImageToSupabase(file, options = {}) {
  const client = await getS3Client();
  if (!client) {
    throw new Error(
      'Upload não configurado. Defina REACT_APP_SUPABASE_S3_ACCESS_KEY_ID e REACT_APP_SUPABASE_S3_SECRET_ACCESS_KEY no .env'
    );
  }

  if (!isImageFile(file)) {
    throw new Error('Selecione um arquivo de imagem (JPG, PNG, WebP, GIF).');
  }

  const maxMb = Number(process.env.REACT_APP_SUPABASE_UPLOAD_MAX_MB || 8);
  if (file.size > maxMb * 1024 * 1024) {
    throw new Error(`Imagem muito grande. Máximo: ${maxMb} MB.`);
  }

  const folder = (options.folder || 'cms').replace(/^\/+|\/+$/g, '');
  const fileName = file.name || 'imagem.jpg';
  const extMatch = fileName.match(/\.([a-zA-Z0-9]+)$/);
  const ext = extMatch ? extMatch[1].toLowerCase() : 'jpg';
  const baseName = sanitizeFileName(fileName.replace(/\.[^.]+$/, '')) || 'imagem';
  const unique = options.uniqueSuffix != null ? `-${options.uniqueSuffix}` : '';
  const objectKey = `${folder}/${Date.now()}${unique}-${baseName}.${ext}`;

  const buffer = await file.arrayBuffer();
  const { PutObjectCommand } = await import('@aws-sdk/client-s3');

  await client.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: objectKey,
      Body: new Uint8Array(buffer),
      ContentType: file.type || 'image/jpeg',
      CacheControl: 'public, max-age=31536000, immutable',
    })
  );

  return {
    path: objectKey,
    url: getSupabasePublicUrl(objectKey),
  };
}

/**
 * @param {FileList|File[]} files
 * @param {{ folder?: string }} [options]
 * @returns {Promise<{ url: string, path: string }[]>}
 */
export async function uploadImagesToSupabase(files, options = {}) {
  const list = Array.from(files || []).filter(isImageFile);
  if (!list.length) {
    throw new Error('Nenhuma imagem válida selecionada (JPG, PNG, WebP, GIF).');
  }

  const results = [];
  for (let i = 0; i < list.length; i += 1) {
    results.push(
      await uploadImageToSupabase(list[i], {
        ...options,
        uniqueSuffix: `${i}-${Math.random().toString(36).slice(2, 8)}`,
      })
    );
  }
  return results;
}
