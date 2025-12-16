import { Plus, Pencil, Trash2, Folder } from "lucide-react";
import { useEffect, useState } from "react";
import { Card } from "../../components/card";
import { API_BASE_URL } from "../../lib/constants";
import { AddCategoryModal } from "../../components/modals/add-category";
import { EditCategoryModal } from "../../components/modals/edit-category";
import { ConfirmDeleteModal } from "../../components/modals/confirm-delete";

export function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);


  async function fetchCategories() {
    const res = await fetch(`${API_BASE_URL}/categories`, {
      credentials: "include",
    });
    setCategories(await res.json());
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  async function handleAdd(name: string) {
    await fetch(`${API_BASE_URL}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name }),
    });
    fetchCategories();
  }

  async function handleUpdate(id: number, name: string) {
    await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name }),
    });
    fetchCategories();
  }

  async function handleDelete(id: number) {
    await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    fetchCategories();
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Categories</h2>
            <p className="text-sm text-gray-500">
              Organize your transactions by category
            </p>
          </div>

          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-black rounded-xl text-sm font-medium text-white shadow-sm transition-all active:scale-95"
          >
            <Plus size={16} /> Add Category
          </button>
        </div>

        {/* Categories List */}
        <Card className="overflow-hidden border border-gray-100 shadow-sm rounded-2xl">
  {categories.length === 0 ? (
    <div className="flex flex-col items-center justify-center py-14 text-gray-400">
      <Folder size={40} />
      <p className="mt-2 text-sm">No categories yet</p>
    </div>
  ) : (
    <div className="divide-y divide-gray-100">
      {categories.map((cat) => (
        <div
          key={cat.id}
          className="
            group flex justify-between items-center
            px-5 py-4
            transition-all
            hover:bg-gray-50/60
          "
        >
          {/* Left */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center font-semibold">
              {cat.name[0]}
            </div>
            <span className="text-sm font-medium text-gray-800">
              {cat.name}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setEditing(cat)}
              className="
                p-2 rounded-lg
                text-gray-400
                hover:text-blue-500
                hover:bg-blue-50
                transition-colors
              "
            >
              <Pencil size={16} />
            </button>
            <button
                onClick={() => setDeleteTarget(cat)}
                className="
                    p-2 rounded-lg
                    text-gray-400
                    hover:text-red-500
                    hover:bg-red-50
                    transition-colors
                "
                >
                <Trash2 size={16} />
            </button>

          </div>
        </div>
      ))}
    </div>
  )}
</Card>

      </div>

      {/* Modals */}
      <AddCategoryModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={handleAdd}
      />

      {editing && (
        <EditCategoryModal
          category={editing}
          onClose={() => setEditing(null)}
          onSave={handleUpdate}
        />
      )}

      {deleteTarget && (
        <ConfirmDeleteModal
            title={deleteTarget.name}
            description="This category will be permanently removed."
            onCancel={() => setDeleteTarget(null)}
            onConfirm={async () => {
            await handleDelete(deleteTarget.id);
            setDeleteTarget(null);
            }}
        />
        )}

    </>
  );
}
