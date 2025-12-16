import { Plus, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Card } from "../../components/card";
import { API_BASE_URL } from "../../lib/constants";
import { AddCategoryModal } from "../../components/modals/add-category";
import { EditCategoryModal } from "../../components/modals/edit-category";

export function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editing, setEditing] = useState(null);

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
    if (!confirm("Delete this category?")) return;

    await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    fetchCategories();
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Categories</h2>
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 hover:bg-black rounded-lg text-xs font-medium text-white"
          >
            <Plus size={14} /> Add
          </button>
        </div>

        <Card noPadding>
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex justify-between items-center px-4 py-3 border-b last:border-0 hover:bg-gray-50"
            >
              <span className="text-sm font-medium text-gray-700">
                {cat.name}
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() => setEditing(cat)}
                  className="p-1 text-gray-400 hover:text-blue-500"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="p-1 text-gray-400 hover:text-red-500"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </Card>
      </div>

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
    </>
  );
}
