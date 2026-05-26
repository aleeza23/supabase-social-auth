"use client";

import { useEffect, useState } from "react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [catFile, setCatFile] = useState<File | null>(null);
  const [catImage, setCatImage] = useState("");
  const fetchCategories = async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data);
  };

  const uploadCategoryImage = async () => {
    if (!catFile) return catImage;

    const formData = new FormData();
    formData.append("file", catFile);

    const res = await fetch("/api/upload-images", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Upload failed");
    }

    return data.url;
  };

  const handleAddCategory = async () => {
    const imageUrl = await uploadCategoryImage();

    await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        image: imageUrl,
      }),
    });

    setName("");
    setCatFile(null);
    fetchCategories();
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const addCategory = async () => {
    if (!name) return;

    await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    setName("");
    fetchCategories();
  };


  console.log(categories, 'cat');
  

  return (
    <div className="p-8 text-white">
      <h1 className="text-2xl font-bold mb-6">Categories</h1>

      <div className="flex gap-3 mb-6">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category name"
          className="px-4 py-2 rounded bg-black border border-white/10"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setCatFile(e.target.files?.[0] || null)}
          className="text-white"
        />

        <button
          onClick={handleAddCategory}
          className="px-4 py-2 bg-amber-400 text-black rounded"
        >
          Add Category
        </button>
      </div>

      <div className="space-y-2">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center gap-3 p-3 border border-white/10 rounded"
          >
            {cat.image && (
              <img src={cat.image} className="w-10 h-10 rounded object-cover" />
            )}

            <span>{cat.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
