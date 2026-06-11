import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listTags, saveTag, deleteTag } from '../../services/newsApi';
import { slugify } from '../../services/contentNormalizer';
import { generateTempId } from '../../utils/contentAdminHelpers';

const TagsAdmin = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [editId, setEditId] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    listTags()
      .then(setTags)
      .catch((err) => setError(err instanceof Error ? err.message : 'Erro'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    setSaving(true);
    setError('');
    try {
      const slug = slugify(trimmed);
      await saveTag({
        id: editId || slug || generateTempId('tag'),
        name: trimmed,
        slug,
        position: tags.length,
      });
      setName('');
      setEditId('');
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, tagName) => {
    if (!window.confirm(`Remover tag "${tagName}"?`)) return;
    try {
      await deleteTag(id);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover');
    }
  };

  return (
    <div>
      <Link to="/admin/materias" className="text-sm text-blue-600 hover:underline">
        ← Matérias
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mt-2 mb-6">Tags</h1>

      {error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-3 mb-4">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-8 flex flex-wrap gap-3 items-end max-w-xl">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {editId ? 'Editar tag' : 'Nova tag'}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Ex.: Campeonato, Seminário..."
            required
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded text-sm font-medium disabled:opacity-50"
        >
          {saving ? 'Salvando...' : 'Salvar'}
        </button>
        {editId && (
          <button
            type="button"
            onClick={() => {
              setEditId('');
              setName('');
            }}
            className="px-4 py-2 border rounded text-sm"
          >
            Cancelar
          </button>
        )}
      </form>

      {loading ? (
        <p className="text-gray-600">Carregando...</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm shadow-sm"
            >
              {tag.name}
              <button
                type="button"
                onClick={() => {
                  setEditId(tag.id);
                  setName(tag.name);
                }}
                className="text-blue-600 hover:underline text-xs"
              >
                editar
              </button>
              <button
                type="button"
                onClick={() => handleDelete(tag.id, tag.name)}
                className="text-red-600 hover:underline text-xs"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagsAdmin;
