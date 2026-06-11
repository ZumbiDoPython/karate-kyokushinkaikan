import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listAuthors, saveAuthor, deleteAuthor } from '../../services/newsApi';
import { generateTempId } from '../../utils/contentAdminHelpers';
import ImageUrlUploadField from '../../components/admin/ImageUrlUploadField';

const AuthorsAdmin = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ id: '', name: '', photo: '', bio: '' });
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    listAuthors()
      .then(setAuthors)
      .catch((err) => setError(err instanceof Error ? err.message : 'Erro'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => setForm({ id: '', name: '', photo: '', bio: '' });

  const handleEdit = (author) => {
    setForm({
      id: author.id,
      name: author.name,
      photo: author.photo || '',
      bio: author.bio || '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    setError('');
    try {
      await saveAuthor({
        id: form.id || generateTempId('author'),
        name: form.name.trim(),
        photo: form.photo,
        bio: form.bio,
        position: authors.length,
      });
      resetForm();
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remover autor "${name}"?`)) return;
    try {
      await deleteAuthor(id);
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
      <h1 className="text-2xl font-bold text-gray-900 mt-2 mb-6">Autores</h1>

      {error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-3 mb-4">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-8 space-y-4 max-w-xl">
        <h2 className="font-semibold text-gray-900">{form.id ? 'Editar autor' : 'Novo autor'}</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <ImageUrlUploadField
          label="Foto (pequena, ex.: rosto)"
          value={form.photo}
          onChange={(photo) => setForm({ ...form, photo })}
          uploadFolder="news/authors"
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Breve descrição</label>
          <textarea
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            rows={3}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            placeholder="Ex.: Mestre 5º dan, instrutor desde 1998..."
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded text-sm font-medium disabled:opacity-50"
          >
            {saving ? 'Salvando...' : 'Salvar autor'}
          </button>
          {form.id && (
            <button type="button" onClick={resetForm} className="px-4 py-2 border rounded text-sm">
              Cancelar edição
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <p className="text-gray-600">Carregando...</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {authors.map((author) => (
            <div key={author.id} className="bg-white rounded-lg shadow p-4 flex gap-3">
              {author.photo && (
                <img
                  src={author.photo}
                  alt={author.name}
                  className="w-14 h-14 rounded-full object-cover border flex-shrink-0"
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-900">{author.name}</p>
                {author.bio && (
                  <p className="text-xs text-gray-600 mt-1 line-clamp-3">{author.bio}</p>
                )}
                <div className="mt-2 flex gap-2 text-xs">
                  <button type="button" onClick={() => handleEdit(author)} className="text-blue-600 hover:underline">
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(author.id, author.name)}
                    className="text-red-600 hover:underline"
                  >
                    Remover
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AuthorsAdmin;
