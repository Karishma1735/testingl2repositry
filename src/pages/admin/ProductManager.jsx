import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  AlertCircle,
  Check,
  Package,
  Star
} from 'lucide-react';
import { productApi } from '../../api/productApi.js';
import { useToast } from '../../context/ToastContext.jsx';
import { CATEGORIES } from '../../components/product/ProductFilters.jsx';

export const ProductManager = () => {
  const { success, error: toastError } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'Tote Bags',
    price: '',
    originalPrice: '',
    countInStock: '10',
    material: 'Full-Grain Italian Calfskin Leather',
    dimensions: '12" W x 9" H x 4.5" D',
    color: 'Noir / Black',
    hardware: 'Brushed Gold-Tone Finish',
    images: '',
    description: '',
    isFeatured: false,
    isBestSeller: false
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await productApi.getProducts({
        limit: 100,
        search: search || undefined,
        category: category !== 'All' ? category : undefined
      });
      if (res.success) {
        setProducts(res.products || []);
      }
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      sku: 'ELG-' + Math.floor(1000 + Math.random() * 9000),
      category: 'Tote Bags',
      price: '',
      originalPrice: '',
      countInStock: '10',
      material: 'Full-Grain Italian Calfskin Leather',
      dimensions: '12" W x 9" H x 4.5" D',
      color: 'Noir / Black',
      hardware: 'Brushed Gold-Tone Finish',
      images: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=80',
      description: 'Handcrafted in Tuscany from full-grain vegetable-tanned calfskin.',
      isFeatured: false,
      isBestSeller: false
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      sku: p.sku || '',
      category: p.category,
      price: p.price.toString(),
      originalPrice: p.originalPrice ? p.originalPrice.toString() : '',
      countInStock: p.countInStock.toString(),
      material: p.material || '',
      dimensions: p.dimensions || '',
      color: p.color || '',
      hardware: p.hardware || '',
      images: Array.isArray(p.images) ? p.images.join('\n') : p.images,
      description: p.description,
      isFeatured: p.isFeatured,
      isBestSeller: p.isBestSeller
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" from the catalog?`)) {
      return;
    }

    try {
      await productApi.deleteProduct(id);
      success(`"${name}" removed from catalog.`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      toastError(err.message || 'Failed to delete product.');
    }
  };

  const handleSubmitModal = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);

      const splitImages = formData.images
        .split('\n')
        .map((img) => img.trim())
        .filter(Boolean);

      const payload = {
        name: formData.name,
        sku: formData.sku,
        category: formData.category,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        countInStock: parseInt(formData.countInStock, 10),
        material: formData.material,
        dimensions: formData.dimensions,
        color: formData.color,
        hardware: formData.hardware,
        images: splitImages,
        description: formData.description,
        isFeatured: Boolean(formData.isFeatured),
        isBestSeller: Boolean(formData.isBestSeller)
      };

      if (editingProduct) {
        await productApi.updateProduct(editingProduct._id, payload);
        success(`Product "${formData.name}" updated successfully.`);
      } else {
        await productApi.createProduct(payload);
        success(`New purse "${formData.name}" added to catalog.`);
      }

      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      toastError(err.message || 'Failed to save product.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-atelier-200 gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-super-wide text-atelier-gold font-semibold">
            Catalog Management
          </span>
          <h1 className="font-serif text-3xl text-atelier-950 font-normal mt-1">
            Handbags & Stock ({products.length})
          </h1>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-6 py-3 bg-atelier-950 text-white text-xs uppercase tracking-luxury hover:bg-atelier-800 transition-colors flex items-center justify-center gap-2 shadow-md"
        >
          <Plus className="w-4 h-4 text-atelier-gold" />
          <span>Add New Handbag</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-surface p-4 border border-atelier-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by handbag name, SKU, or material..."
            className="w-full pl-9 pr-24 py-2 bg-atelier-50 border border-atelier-200 text-xs focus:outline-none focus:border-atelier-950"
          />
          <Search className="w-4 h-4 text-atelier-400 absolute left-3 top-2.5" />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 px-3 py-1 bg-atelier-950 text-white text-[10px] uppercase tracking-wider"
          >
            Search
          </button>
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-atelier-500 uppercase">Category:</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-atelier-50 border border-atelier-200 text-xs p-2 focus:outline-none"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-surface border border-atelier-200 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-atelier-50 border-b border-atelier-200 text-[10px] uppercase tracking-wider text-atelier-600">
            <tr>
              <th className="p-4 pl-6">Purse</th>
              <th className="p-4">SKU</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Badges</th>
              <th className="p-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-atelier-150">
            {loading ? (
              <tr>
                <td colSpan="7" className="p-8 text-center text-atelier-500">
                  Loading catalog inventory...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-8 text-center text-atelier-500">
                  No purses found matching criteria.
                </td>
              </tr>
            ) : (
              products.map((p) => {
                const isLowStock = p.countInStock <= 3;
                return (
                  <tr key={p._id} className="hover:bg-atelier-50/70 transition-colors">
                    <td className="p-4 pl-6 flex items-center gap-3">
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-12 h-14 object-cover object-center bg-atelier-150 border border-atelier-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-medium text-atelier-950 truncate max-w-xs">{p.name}</p>
                        <p className="text-[10px] text-atelier-500 truncate max-w-xs">{p.material}</p>
                      </div>
                    </td>

                    <td className="p-4 font-mono text-atelier-700">
                      {p.sku}
                    </td>

                    <td className="p-4 text-atelier-700">
                      {p.category}
                    </td>

                    <td className="p-4 font-serif font-bold text-atelier-950">
                      ${p.price.toFixed(2)}
                    </td>

                    <td className="p-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider ${
                          isLowStock
                            ? 'bg-red-100 text-red-800'
                            : 'bg-emerald-100 text-emerald-900'
                        }`}
                      >
                        {p.countInStock} In Stock
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex gap-1">
                        {p.isBestSeller && (
                          <span className="text-[9px] bg-atelier-950 text-white px-1.5 py-0.5 uppercase">
                            Bestseller
                          </span>
                        )}
                        {p.isFeatured && (
                          <span className="text-[9px] bg-accent text-accent-foreground px-1.5 py-0.5 uppercase font-medium">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="p-1.5 text-atelier-600 hover:text-atelier-950 transition-colors"
                          title="Edit Purse"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p._id, p.name)}
                          className="p-1.5 text-atelier-400 hover:text-red-700 transition-colors"
                          title="Delete Purse"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface max-w-2xl w-full p-8 shadow-2xl border border-atelier-200 max-h-[90vh] overflow-y-auto space-y-6 animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-atelier-200">
              <h3 className="font-serif text-xl text-atelier-950 font-normal">
                {editingProduct ? 'Edit Handbag' : 'Add Handbag to Catalog'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-atelier-400 hover:text-atelier-950"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitModal} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block uppercase tracking-wider text-atelier-600 font-semibold mb-1">
                    Purse Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="e.g. The Sovereign Grande Tote"
                    className="w-full bg-atelier-50 border border-atelier-200 p-2.5 text-atelier-900 focus:outline-none focus:border-atelier-950"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-atelier-600 font-semibold mb-1">
                    SKU Code *
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    required
                    className="w-full bg-atelier-50 border border-atelier-200 p-2.5 text-atelier-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-atelier-600 font-semibold mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-atelier-50 border border-atelier-200 p-2.5 text-atelier-900 focus:outline-none"
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-atelier-600 font-semibold mb-1">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    placeholder="495"
                    className="w-full bg-atelier-50 border border-atelier-200 p-2.5 text-atelier-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-atelier-600 font-semibold mb-1">
                    Original / Strikethrough Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    placeholder="580"
                    className="w-full bg-atelier-50 border border-atelier-200 p-2.5 text-atelier-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-atelier-600 font-semibold mb-1">
                    Inventory Stock Count *
                  </label>
                  <input
                    type="number"
                    value={formData.countInStock}
                    onChange={(e) => setFormData({ ...formData, countInStock: e.target.value })}
                    required
                    className="w-full bg-atelier-50 border border-atelier-200 p-2.5 text-atelier-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-atelier-600 font-semibold mb-1">
                    Color Variant
                  </label>
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="Warm Cognac"
                    className="w-full bg-atelier-50 border border-atelier-200 p-2.5 text-atelier-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-atelier-600 font-semibold mb-1">
                    Leather / Material
                  </label>
                  <input
                    type="text"
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    placeholder="Full-Grain Tuscan Calfskin Leather"
                    className="w-full bg-atelier-50 border border-atelier-200 p-2.5 text-atelier-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-atelier-600 font-semibold mb-1">
                    Dimensions
                  </label>
                  <input
                    type="text"
                    value={formData.dimensions}
                    onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                    placeholder='16.5" W x 12.0" H x 6.5" D'
                    className="w-full bg-atelier-50 border border-atelier-200 p-2.5 text-atelier-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-atelier-600 font-semibold mb-1">
                    Hardware
                  </label>
                  <input
                    type="text"
                    value={formData.hardware}
                    onChange={(e) => setFormData({ ...formData, hardware: e.target.value })}
                    placeholder="Brushed Brass Finished in Antique Gold"
                    className="w-full bg-atelier-50 border border-atelier-200 p-2.5 text-atelier-900 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block uppercase tracking-wider text-atelier-600 font-semibold mb-1">
                    Image URLs (one URL per line) *
                  </label>
                  <textarea
                    rows="3"
                    value={formData.images}
                    onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                    required
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full bg-atelier-50 border border-atelier-200 p-2.5 text-atelier-900 focus:outline-none font-mono text-[11px]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block uppercase tracking-wider text-atelier-600 font-semibold mb-1">
                    Narrative Description *
                  </label>
                  <textarea
                    rows="4"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    className="w-full bg-atelier-50 border border-atelier-200 p-2.5 text-atelier-900 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2 flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="accent-atelier-950 w-4 h-4"
                    />
                    <span>Mark as Signature / Featured</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isBestSeller}
                      onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                      className="accent-atelier-950 w-4 h-4"
                    />
                    <span>Mark as Best Seller</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-atelier-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-atelier-300 text-atelier-700 hover:bg-atelier-50 uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-7 py-2.5 bg-atelier-950 text-white uppercase tracking-luxury hover:bg-atelier-800 disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingProduct ? 'Update Handbag' : 'Create Handbag'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
