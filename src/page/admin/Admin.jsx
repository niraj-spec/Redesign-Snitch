import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase/FirebaseConfig";
import { v4 as uuidv4 } from "uuid";
import { toast } from 'react-toastify';

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

function Admin() {
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      category: "",
      originalPrice: 0,
      discountPercent: 0,
      image: [""],
      rating: { rate: 0, count: 0 },
      sizes: [],
      specifications: [{ key: "", value: "" }],
    },
  });

  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
    control,
    name: "image",
  });

  const {
    fields: specFields,
    append: appendSpecification,
    remove: removeSpecification,
  } = useFieldArray({
    control,
    name: "specifications",
  });

  const watchOriginalPrice = watch("originalPrice");
  const watchDiscount = watch("discountPercent");

  const finalPrice =
    parseFloat(watchOriginalPrice) && parseFloat(watchDiscount)
      ? (parseFloat(watchOriginalPrice) -
          (parseFloat(watchOriginalPrice) * parseFloat(watchDiscount)) / 100).toFixed(2)
      : 0;

  useEffect(() => {
    if (imageFields.length === 0) {
      appendImage("");
    }
  }, []);

  const onSubmit = async (data) => {
    try {
      // Debugging
      console.log("Form Data Submitted:", data);
      const uploadedImageUrls = data.image.filter(url => url.trim() !== "");

      const productData = {
        title: data.title,
        description: data.description,
        category: data.category,
        originalPrice: parseFloat(data.originalPrice),
        discountPercent: parseFloat(data.discountPercent),
        finalPrice: parseFloat(finalPrice),
        images: uploadedImageUrls.filter(Boolean),
        rating: {
          rate: parseFloat(data.rating.rate),
          count: parseInt(data.rating.count),
        },
        sizes: data.sizes,
        specifications: data.specifications.filter((spec) => spec.key && spec.value),
        createdAt: new Date(),
      };

      await addDoc(collection(db, "products"), productData);

      toast.success('✅ Product added successfully!');
      reset();
    } catch (err) {
      console.error("❌ Error submitting product:", err);
      toast.error('❌ Failed to add product. Check console.');
      
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-3xl mx-auto p-6 bg-white rounded shadow-md space-y-5"
    >
      <h2 className="text-2xl font-bold text-center mb-6">Add New Product</h2>

      {/* Title */}
      <div>
        <label className="font-semibold block mb-1">Title</label>
        <input
          {...register("title", { required: "Title is required" })}
          className="w-full border px-3 py-2"
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="font-semibold block mb-1">Description</label>
        <textarea
          {...register("description")}
          rows={3}
          className="w-full border px-3 py-2"
        />
      </div>

      {/* Category */}
      <div>
        <label className="font-semibold block mb-1">Category</label>
        <input
          {...register("category", { required: "Category is required" })}
          className="w-full border px-3 py-2"
        />
        {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
      </div>

      {/* Original Price */}
      <div>
        <label className="font-semibold block mb-1">Original Price (₹)</label>
        <input
          type="number"
          {...register("originalPrice", { required: true })}
          className="w-full border px-3 py-2"
        />
      </div>

      {/* Discount % */}
      <div>
        <label className="font-semibold block mb-1">Discount (%)</label>
        <input
          type="number"
          {...register("discountPercent", { required: true })}
          className="w-full border px-3 py-2"
        />
      </div>

      {/* Final Price */}
      <div>
        <label className="font-semibold block mb-1">Price After Discount</label>
        <input
          type="text"
          value={`₹${finalPrice}`}
          disabled
          className="w-full border bg-gray-100 text-gray-700 px-3 py-2"
        />
      </div>

      {/* Sizes */}
      <div>
        <label className="font-semibold block mb-1">Available Sizes</label>
        <div className="flex flex-wrap gap-3">
          {SIZES.map((size) => (
            <label key={size} className="flex items-center gap-2 text-sm">
              <input type="checkbox" value={size} {...register("sizes")} />
              {size}
            </label>
          ))}
        </div>
      </div>

      {/* Specifications */}
      <div>
        <label className="font-semibold block mb-2">Product Specifications</label>
        {specFields.map((field, index) => (
          <div key={field.id} className="flex gap-2 items-center mb-2">
            <input
              placeholder="Key"
              {...register(`specifications.${index}.key`)}
              className="w-1/3 border px-2 py-1"
            />
            <input
              placeholder="Value"
              {...register(`specifications.${index}.value`)}
              className="w-2/3 border px-2 py-1"
            />
            <button type="button" onClick={() => removeSpecification(index)} className="text-red-500">
              ×
            </button>
          </div>
        ))}
        <button type="button" onClick={() => appendSpecification({ key: "", value: "" })}>
          + Add Specification
        </button>
      </div>

      {/* Image Upload */}
      {/* Image URLs Input */}
<div>
  <label className="block font-semibold mb-1">Product Image URLs</label>
  {imageFields.map((field, index) => (
    <div key={field.id} className="flex items-center gap-2 mb-2">
      <input
        type="text"
        placeholder="Enter image URL"
        {...register(`image.${index}`, {
          required: "Image URL is required",
        })}
        className="flex-1 border px-3 py-2"
      />
      {imageFields.length > 1 && (
        <button
          type="button"
          onClick={() => removeImage(index)}
          className="text-red-600 text-lg"
        >
          −
        </button>
      )}
      {index === imageFields.length - 1 && (
        <button
          type="button"
          onClick={() => appendImage("")}
          className="text-green-600 text-lg"
        >
          +
        </button>
      )}
    </div>
  ))}
</div>


      {/* Ratings */}
      <div className="flex gap-4">
        <div className="w-1/2">
          <label className="block font-semibold mb-1">Rating (rate)</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="5"
            {...register("rating.rate", { required: true })}
            className="w-full border px-3 py-2"
          />
        </div>
        <div className="w-1/2">
          <label className="block font-semibold mb-1">Rating (count)</label>
          <input
            type="number"
            min="0"
            {...register("rating.count", { required: true })}
            className="w-full border px-3 py-2"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-2 mt-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
      >
        Add Product
      </button>
    </form>
  );
}

export default Admin;
