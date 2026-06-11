import React, { useId, useRef, useState } from 'react';
import { uploadImageToSupabase, isSupabaseStorageConfigured } from '../../services/supabaseStorage';

/**
 * Campo: colar URL ou enviar imagem para o Storage (S3) do Supabase.
 */
const ImageUrlUploadField = ({
  label = 'Imagem',
  value = '',
  onChange,
  uploadFolder = 'cms',
  placeholder = 'https://...',
}) => {
  const inputId = useId();
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const storageReady = isSupabaseStorageConfigured();

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setError('');
    setUploading(true);
    try {
      const { url } = await uploadImageToSupabase(file, { folder: uploadFolder });
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha no upload');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}

      <input
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
        placeholder={placeholder}
      />

      <div className="flex flex-wrap items-center gap-2">
        <input
          id={inputId}
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/*,.jpg,.jpeg,.png,.webp,.gif"
          className="sr-only"
          onChange={handleFile}
          tabIndex={-1}
        />
        <label
          htmlFor={inputId}
          className={`text-xs px-3 py-1.5 bg-yellow-500 text-gray-900 font-medium rounded ${
            !storageReady || uploading
              ? 'opacity-50 pointer-events-none cursor-not-allowed'
              : 'hover:bg-yellow-600 cursor-pointer'
          }`}
        >
          {uploading ? 'Enviando...' : 'Enviar imagem'}
        </label>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-xs px-2 py-1 border border-gray-300 rounded hover:bg-gray-50"
          >
            Limpar
          </button>
        )}
      </div>

      {!storageReady && (
        <p className="text-xs text-amber-700">
          Upload desativado — configure as chaves S3 do Supabase no <code>.env</code> (veja
          .env.example).
        </p>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}

      {value && (
        <img
          src={value}
          alt=""
          className="max-h-40 rounded border object-contain bg-white"
          onError={() => setError('Não foi possível carregar a pré-visualização desta URL.')}
        />
      )}
    </div>
  );
};

export default ImageUrlUploadField;
