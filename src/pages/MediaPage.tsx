import { useState, useRef } from 'react';
import { MediaItem } from '../types';
import { compressImage } from '../store';
import { Upload, Trash2, Search, Grid, List, X, Image as ImageIcon, Copy, Download, FolderPlus, Check } from 'lucide-react';

interface Props {
  media: MediaItem[];
  setMedia: React.Dispatch<React.SetStateAction<MediaItem[]>>;
  onSelect?: (url: string) => void;
  selectMode?: boolean;
}

export default function MediaPage({ media, setMedia, onSelect, selectMode }: Props) {
  const [search, setSearch] = useState('');
  const [folderFilter, setFolderFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const folders = ['all', ...new Set(media.map(m => m.folder))];
  const filtered = media.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchFolder = folderFilter === 'all' || m.folder === folderFilter;
    return matchSearch && matchFolder;
  });

  const totalSize = media.reduce((s, m) => s + m.size, 0);
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadProgress(0);
    const newItems: MediaItem[] = [];
    const total = files.length;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;
      try {
        const compressed = await compressImage(file, 500, 0.75);
        newItems.push({
          id: Date.now().toString() + i,
          name: file.name.replace(/\.[^/.]+$/, ''),
          url: compressed,
          type: file.type,
          size: file.size,
          folder: folderFilter === 'all' ? 'General' : folderFilter,
          tags: [],
          createdAt: new Date().toISOString().split('T')[0],
        });
        setUploadProgress(Math.round(((i + 1) / total) * 100));
      } catch (e) {
        console.error('Failed to process image:', e);
      }
    }

    setMedia(prev => [...newItems, ...prev]);
    setUploading(false);
    setShowUpload(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this image?')) {
      setMedia(prev => prev.filter(m => m.id !== id));
      if (previewItem?.id === id) setPreviewItem(null);
    }
  };

  const handleBulkDelete = () => {
    if (selectedItems.length === 0) return;
    if (confirm(`Delete ${selectedItems.length} selected items?`)) {
      setMedia(prev => prev.filter(m => !selectedItems.includes(m.id)));
      setSelectedItems([]);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const createFolder = () => {
    if (newFolderName.trim()) {
      setFolderFilter(newFolderName.trim());
      setShowNewFolder(false);
      setNewFolderName('');
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
  };

  const downloadImage = (item: MediaItem) => {
    const a = document.createElement('a');
    a.href = item.url;
    a.download = item.name + '.jpg';
    a.click();
  };

  // Select mode - for picking images for products
  if (selectMode) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => onSelect?.('')}>
        <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
          <div className="p-4 border-b flex items-center justify-between shrink-0">
            <h3 className="text-lg font-semibold">Select Image</h3>
            <button onClick={() => onSelect?.('')} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
          </div>
          <div className="p-4 border-b flex gap-2 shrink-0">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm" />
            </div>
            <button onClick={() => fileInputRef.current?.click()} className="bg-emerald-600 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-1">
              <Upload className="w-4 h-4" /> Upload
            </button>
          </div>
          <div className="flex-1 overflow-auto p-4">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No images yet. Upload some to get started.</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {filtered.map(item => (
                  <button key={item.id} onClick={() => onSelect?.(item.url)}
                    className="aspect-square rounded-lg overflow-hidden border-2 hover:border-emerald-500 transition-colors relative group">
                    <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <Check className="w-6 h-6 text-white opacity-0 group-hover:opacity-100" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={e => handleFiles(e.target.files)} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-sm text-gray-500">Total Files</p>
          <p className="text-2xl font-bold text-gray-800">{media.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-sm text-gray-500">Storage Used</p>
          <p className="text-2xl font-bold text-gray-800">{formatSize(totalSize)}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-sm text-gray-500">Folders</p>
          <p className="text-2xl font-bold text-gray-800">{folders.length - 1}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-sm text-gray-500">Storage Limit</p>
          <p className="text-2xl font-bold text-amber-600">~5 MB</p>
          <p className="text-xs text-gray-400">localStorage</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search by name or tag..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
          </div>
          <select value={folderFilter} onChange={e => setFolderFilter(e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
            {folders.map(f => <option key={f} value={f}>{f === 'all' ? 'All Folders' : f}</option>)}
          </select>
          <div className="flex gap-1 border rounded-lg p-0.5">
            <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-400'}`}><Grid className="w-4 h-4" /></button>
            <button onClick={() => setViewMode('list')} className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-400'}`}><List className="w-4 h-4" /></button>
          </div>
          <button onClick={() => setShowNewFolder(true)} className="border rounded-lg px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-1">
            <FolderPlus className="w-4 h-4" /> New Folder
          </button>
          <button onClick={() => setShowUpload(true)} className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 flex items-center gap-2">
            <Upload className="w-4 h-4" /> Upload
          </button>
          {selectedItems.length > 0 && (
            <button onClick={handleBulkDelete} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 flex items-center gap-2">
              <Trash2 className="w-4 h-4" /> Delete ({selectedItems.length})
            </button>
          )}
        </div>
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-emerald-700">Uploading images...</span>
            <span className="text-sm text-emerald-600">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-emerald-200 rounded-full h-2">
            <div className="bg-emerald-600 h-2 rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
          </div>
        </div>
      )}

      {/* Media Grid/List */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <ImageIcon className="w-16 h-16 mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium mb-1">No images found</p>
            <p className="text-sm">Upload images to get started with your media library</p>
            <button onClick={() => setShowUpload(true)} className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 inline-flex items-center gap-2">
              <Upload className="w-4 h-4" /> Upload Images
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {filtered.map(item => (
              <div key={item.id} className={`group relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all hover:shadow-md ${selectedItems.includes(item.id) ? 'border-emerald-500 ring-2 ring-emerald-200' : 'border-transparent hover:border-emerald-300'}`}>
                <img src={item.url} alt={item.name} className="w-full h-full object-cover" onClick={() => setPreviewItem(item)} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-xs font-medium truncate">{item.name}</p>
                  <p className="text-white/70 text-xs">{formatSize(item.size)}</p>
                </div>
                <div className="absolute top-1 left-1">
                  <input type="checkbox" checked={selectedItems.includes(item.id)} onChange={() => toggleSelect(item.id)}
                    className="w-4 h-4 rounded border-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" />
                </div>
                <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={(e) => { e.stopPropagation(); downloadImage(item); }} className="p-1 bg-white/90 rounded hover:bg-white"><Download className="w-3 h-3" /></button>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }} className="p-1 bg-white/90 rounded hover:bg-white"><Trash2 className="w-3 h-3 text-red-500" /></button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 w-8"></th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Preview</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Folder</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Size</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2"><input type="checkbox" checked={selectedItems.includes(item.id)} onChange={() => toggleSelect(item.id)} className="w-4 h-4 rounded" /></td>
                    <td className="px-4 py-2"><img src={item.url} alt={item.name} className="w-10 h-10 rounded object-cover cursor-pointer" onClick={() => setPreviewItem(item)} /></td>
                    <td className="px-4 py-2 font-medium">{item.name}</td>
                    <td className="px-4 py-2"><span className="px-2 py-0.5 bg-gray-100 rounded text-xs">{item.folder}</span></td>
                    <td className="px-4 py-2 text-gray-500">{formatSize(item.size)}</td>
                    <td className="px-4 py-2 text-gray-500">{item.createdAt}</td>
                    <td className="px-4 py-2">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => downloadImage(item)} className="p-1.5 hover:bg-gray-100 rounded"><Download className="w-4 h-4 text-gray-500" /></button>
                        <button onClick={() => handleDelete(item.id)} className="p-1.5 hover:bg-gray-100 rounded"><Trash2 className="w-4 h-4 text-red-500" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowUpload(false)}>
          <div className="bg-white rounded-xl max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">Upload Images</h3>
              <button onClick={() => setShowUpload(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-emerald-400 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={e => e.preventDefault()}
                onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
              >
                <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-700">Click or drag images here</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP • Max 5MB each</p>
                <p className="text-xs text-amber-600 mt-2">Images are compressed to save storage</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Save to Folder</label>
                <select value={folderFilter === 'all' ? 'General' : folderFilter} onChange={e => setFolderFilter(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm">
                  {folders.filter(f => f !== 'all').map(f => <option key={f} value={f}>{f}</option>)}
                  <option value="General">General</option>
                </select>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={e => handleFiles(e.target.files)} />
            </div>
          </div>
        </div>
      )}

      {/* New Folder Modal */}
      {showNewFolder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowNewFolder(false)}>
          <div className="bg-white rounded-xl max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">New Folder</h3>
              <button onClick={() => setShowNewFolder(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <input type="text" value={newFolderName} onChange={e => setNewFolderName(e.target.value)} placeholder="Folder name..." className="w-full border rounded-lg px-3 py-2 text-sm" autoFocus />
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowNewFolder(false)} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">Cancel</button>
                <button onClick={createFolder} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700">Create</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setPreviewItem(null)}>
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold truncate">{previewItem.name}</h3>
              <div className="flex items-center gap-2">
                <button onClick={() => { copyToClipboard(previewItem.url); }} className="p-1.5 hover:bg-gray-100 rounded" title="Copy URL"><Copy className="w-4 h-4 text-gray-500" /></button>
                <button onClick={() => downloadImage(previewItem)} className="p-1.5 hover:bg-gray-100 rounded" title="Download"><Download className="w-4 h-4 text-gray-500" /></button>
                <button onClick={() => { handleDelete(previewItem.id); }} className="p-1.5 hover:bg-gray-100 rounded" title="Delete"><Trash2 className="w-4 h-4 text-red-500" /></button>
                <button onClick={() => setPreviewItem(null)}><X className="w-5 h-5" /></button>
              </div>
            </div>
            <div className="p-4">
              <img src={previewItem.url} alt={previewItem.name} className="w-full rounded-lg" />
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-gray-500">File Size:</span> <span className="font-medium">{formatSize(previewItem.size)}</span></div>
                <div><span className="text-gray-500">Type:</span> <span className="font-medium">{previewItem.type}</span></div>
                <div><span className="text-gray-500">Folder:</span> <span className="font-medium">{previewItem.folder}</span></div>
                <div><span className="text-gray-500">Uploaded:</span> <span className="font-medium">{previewItem.createdAt}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
