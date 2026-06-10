# Imagens no admin (Supabase Storage / S3)

No editor de conteúdo, cada bloco **Imagem** e o campo **Parallax** permitem:

1. **Colar uma URL** (Imgur, link externo, etc.)
2. **Enviar imagem** — sobe para o bucket no Supabase e preenche a URL automaticamente

## Configuração no Supabase

1. [Storage](https://supabase.com/dashboard/project/mbfrccetbupdaptoptsm/storage/buckets) → **New bucket**
2. Nome: `wkk-bucket` (ou o valor de `REACT_APP_SUPABASE_STORAGE_BUCKET`)
3. Marque **Public bucket** (leitura pública das imagens do site)
4. [Storage → S3](https://supabase.com/dashboard/project/mbfrccetbupdaptoptsm/storage/s3) → gere ou use as access keys

## Variáveis no `.env` / `.env.production`

```env
REACT_APP_SUPABASE_URL=https://mbfrccetbupdaptoptsm.supabase.co
REACT_APP_SUPABASE_PROJECT_REF=mbfrccetbupdaptoptsm
REACT_APP_SUPABASE_STORAGE_BUCKET=wkk-bucket
REACT_APP_SUPABASE_S3_ACCESS_KEY_ID=...
REACT_APP_SUPABASE_S3_SECRET_ACCESS_KEY=...
REACT_APP_SUPABASE_S3_REGION=us-east-1
```

Após alterar o `.env`, rode `npm run build` e faça deploy de novo.

## Segurança

As chaves S3 entram no build do React (visíveis no JS do navegador). Use um par de chaves **só para este site** e restrinja permissões no Supabase. Se o repositório for público, **não commite** o `.env.production`.

URL pública das imagens:

`https://mbfrccetbupdaptoptsm.supabase.co/storage/v1/object/public/wkk-bucket/cms/...`
