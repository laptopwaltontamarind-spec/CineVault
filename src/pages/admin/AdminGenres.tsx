import React, { useState } from 'react';
import { Tags, Plus, Edit2, Trash2, Check, X, AlertCircle } from 'lucide-react';
import { useMovieContext } from '../../context/MovieContext';
import { AdminLayout } from '../../components/AdminLayout';
import { Genre } from '../../types';

export const AdminGenres: React.FC = () => {
  const { genres, movies, addGenre, updateGenre, deleteGenre } = useMovieContext();

  const [newGenreName, setNewGenreName] = useState('');
  const [newGenreDesc, setNewGenreDesc] = useState('');
  const [editingGenre, setEditingGenre] = useState<Genre | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!newGenreName.trim()) {
      setError('Genre name cannot be blank.');
      return;
    }
    if (genres.some(g => g.name.toLowerCase() === newGenreName.trim().toLowerCase())) {
      setError('A genre with this name already exists.');
      return;
    }
    addGenre(newGenreName.trim(), newGenreDesc.trim());
    setNewGenreName('');
    setNewGenreDesc('');
  };

  const startEdit = (g: Genre) => {
    setEditingGenre(g);
    setEditName(g.name);
    setEditDesc(g.description || '');
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGenre || !editName.trim()) return;
    updateGenre(editingGenre._id, editName.trim(), editDesc.trim());
    setEditingGenre(null);
  };

  return (
    <AdminLayout
      activeTab="genres"
      title="Category &amp; Genre Management"
      subtitle="Organize cinematic taxonomy, add new genres, and monitor movie allocations."
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Col: Add New Genre Form */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base text-white">Add New Genre</h3>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Genre Name</label>
              <input
                type="text"
                required
                value={newGenreName}
                onChange={(e) => setNewGenreName(e.target.value)}
                placeholder="e.g. Noir, Historical, Musical..."
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Description (Optional)</label>
              <textarea
                rows={2}
                value={newGenreDesc}
                onChange={(e) => setNewGenreDesc(e.target.value)}
                placeholder="Brief thematic summary..."
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl transition-colors shadow-md shadow-amber-500/20"
            >
              Add Genre to Catalog
            </button>
          </form>
        </div>

        {/* Right Col: Genres List Table */}
        <div className="lg:col-span-7 rounded-2xl border border-zinc-800 overflow-hidden bg-zinc-900/60">
          <div className="p-4 bg-zinc-950/60 border-b border-zinc-800 flex items-center justify-between">
            <h3 className="font-bold text-sm text-white">Configured Genres ({genres.length})</h3>
          </div>

          <div className="divide-y divide-zinc-800/60">
            {genres.map((g) => {
              const count = movies.filter(m => m.genre.includes(g.name)).length;
              const isEditing = editingGenre?._id === g._id;

              if (isEditing) {
                return (
                  <form key={g._id} onSubmit={handleEditSubmit} className="p-4 bg-zinc-950/80 space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        required
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="px-2.5 py-1.5 bg-zinc-900 border border-amber-500 text-xs text-white rounded-lg outline-none"
                      />
                      <input
                        type="text"
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        placeholder="Description"
                        className="flex-1 px-2.5 py-1.5 bg-zinc-900 border border-zinc-700 text-xs text-zinc-300 rounded-lg outline-none"
                      />
                      <button
                        type="submit"
                        className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg"
                        title="Save changes"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingGenre(null)}
                        className="p-1.5 bg-zinc-800 text-zinc-400 hover:text-white rounded-lg"
                        title="Cancel"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </form>
                );
              }

              return (
                <div key={g._id} className="p-3.5 flex items-center justify-between gap-4 hover:bg-zinc-800/30 transition-colors">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-white">{g.name}</span>
                      <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] text-amber-400 font-mono">
                        {count} movies
                      </span>
                    </div>
                    {g.description && (
                      <p className="text-[11px] text-zinc-400 line-clamp-1">{g.description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => startEdit(g)}
                      className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => deleteGenre(g._id)}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
