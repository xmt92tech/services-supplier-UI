import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export function useFormManager(api, initialForm) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  // fetch items on mount
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const data = await api.getAll();
      setItems(data);
    } catch (err) {
      console.error("Error fetching items:", err);
      toast.error(err.response?.data?.message || "❌ Failed to fetch items");
    }
  };

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleSave = async (transformPayload) => {
    try {
      const payload = transformPayload ? transformPayload(form) : form;

      if (editingId) {
        await api.update(editingId, payload);
        toast.success("✅ Updated successfully!");
      } else {
        await api.create(payload);
        toast.success("✅ Created successfully!");
      }

      await fetchItems();
      resetForm();
    } catch (err) {
      console.error("Error saving:", err);
      toast.error(err.response?.data?.message || "❌ Failed to save");
    }
  };

  const handleEdit = (item, transformForm) => {
    setForm(transformForm ? transformForm(item) : item);
    setEditingId(item.id);
    toast.info(`✏️ Editing ${item.name || "item"}`);
  };

  const handleDelete = async (id) => {
    try {
      await api.remove(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      if (editingId === id) resetForm();
      toast.success("🗑️ Deleted successfully!");
    } catch (err) {
      console.error("Error deleting:", err);
      toast.error(err.response?.data?.message || "❌ Failed to delete");
    }
  };

  return {
    items,
    form,
    editingId,
    handleChange,
    handleSave,
    handleEdit,
    handleDelete,
    resetForm,
  };
}
