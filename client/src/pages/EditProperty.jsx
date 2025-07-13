import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Loader2, Trash2, Trash2Icon } from "lucide-react";
import toast from "react-hot-toast";

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    images: [], // Ensure images is always an array
  });
  const [updating, setUpdating] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchProperty = async () => {
    try {
      const res = await fetch(`/api/property/${id}`);
      const data = await res.json();
      if (data.status === "success") {
        const prop = data.data;
        setProperty(prop);
        setForm({
          ...prop,
          images: prop.images || [], // Ensure images is an array
        });
      } else {
        toast.error("Failed to fetch property");
      }
    } catch (err) {
      console.error("Fetch failed", err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const currentImageCount = form.images?.length || 0;

    if (files.length + currentImageCount > 6) {
      return toast.error("You can only upload up to 6 images.");
    }

    setUploading(true);
    try {
      const uploaded = await Promise.all(
        files.map(async (file) => {
          const data = new FormData();
          data.append("file", file);
          data.append(
            "upload_preset",
            import.meta.env.VITE_CLOUDINARY_UNSIGNED_PRESET
          );

          const res = await fetch(
            `https://api.cloudinary.com/v1_1/${
              import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
            }/image/upload`,
            { method: "POST", body: data }
          );

          const resData = await res.json();
          if (!res.ok || resData.error) {
            throw new Error("Upload failed");
          }

          return resData.secure_url;
        })
      );

      setForm((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...uploaded],
      }));
      toast.success("Images uploaded!");
    } catch (err) {
      console.error(err);
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleImageDelete = (index) => {
    const updatedImages = [...(form.images || [])];
    updatedImages.splice(index, 1);
    setForm((prev) => ({ ...prev, images: updatedImages }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await fetch(`/api/property/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.status !== "success") {
        toast.error("Something went wrong!");
        return;
      }

      toast.success("Updated successfully!");
      navigate("/manage-properties");
    } catch (err) {
      console.error("Update failed", err);
      toast.error("Something went wrong!");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete this property?"
    );
    if (!confirm) return;

    try {
      const res = await fetch(`/api/property/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (data.status !== "success") {
        toast.error(data.message || "Failed to delete property.");
        return;
      }

      toast.success("Property deleted successfully!", {
        style: {
          border: "2px solid black",
          boxShadow: "3px 3px 0 black",
          background: "#fffbea",
          color: "#000",
        },
        iconTheme: {
          primary: "black",
          secondary: "#fffbea",
        },
      });

      setTimeout(() => navigate("/manage-properties"), 1000);
    } catch (error) {
      console.error("Error deleting property:", error);
      toast.error("Something went wrong!");
    }
  };

  useEffect(() => {
    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-6 h-6 animate-spin text-black" />
      </div>
    );
  }

  if (!property || currentUser?._id !== property.owner?._id) {
    return (
      <div className="text-center text-red-500 mt-10">
        You are not authorized to edit this property.
      </div>
    );
  }

  return (
    <section className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex gap-2 mb-4">
        <span className="w-3 h-3 bg-red-500 rounded-full" />
        <span className="w-3 h-3 bg-yellow-500 rounded-full" />
        <span className="w-3 h-3 bg-green-500 rounded-full" />
      </div>

      <h2 className="text-2xl font-extrabold uppercase tracking-wider mb-6">
        Edit Property
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white border-2 border-black p-6 rounded-md shadow-[3px_3px_0px_#000] space-y-6"
      >
        {/* Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            name="name"
            value={form.name || ""}
            onChange={handleChange}
            placeholder="Property Name"
            required
            className="input"
          />
          <input
            name="type"
            value={form.type || ""}
            onChange={handleChange}
            placeholder="Type (rent, sale, hostel, pg)"
            required
            className="input"
          />
        </div>

        <textarea
          name="description"
          value={form.description || ""}
          onChange={handleChange}
          placeholder="Description"
          required
          rows={4}
          className="input w-full"
        />

        {/* Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            name="address"
            value={form.address || ""}
            onChange={handleChange}
            placeholder="Address"
            required
            className="input"
          />
          <input
            name="city"
            value={form.city || ""}
            onChange={handleChange}
            placeholder="City"
            required
            className="input"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            name="state"
            value={form.state || ""}
            onChange={handleChange}
            placeholder="State"
            required
            className="input"
          />
          <input
            name="pincode"
            value={form.pincode || ""}
            onChange={handleChange}
            placeholder="Pincode"
            required
            className="input"
          />
        </div>

        {/* Prices */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            name="regularPrice"
            value={form.regularPrice || ""}
            onChange={handleChange}
            placeholder="Regular Price"
            type="number"
            required
            className="input"
          />
          <input
            name="discountedPrice"
            value={form.discountedPrice || ""}
            onChange={handleChange}
            placeholder="Discounted Price"
            type="number"
            className="input"
          />
        </div>

        {/* Rooms */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            name="bedRooms"
            value={form.bedRooms || ""}
            onChange={handleChange}
            placeholder="Bedrooms"
            type="number"
            required
            className="input"
          />
          <input
            name="bathRooms"
            value={form.bathRooms || ""}
            onChange={handleChange}
            placeholder="Bathrooms"
            type="number"
            required
            className="input"
          />
        </div>

        <input
          name="contactNo"
          value={form.contactNo || ""}
          onChange={handleChange}
          placeholder="Contact Number"
          required
          className="input w-full"
        />

        {/* Checkboxes */}
        <div className="flex flex-wrap gap-6 mt-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="furnished"
              checked={form.furnished || false}
              onChange={handleChange}
              className="accent-black w-4 h-4"
            />
            <span className="text-sm font-medium">Furnished</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isAvailable"
              checked={form.isAvailable || false}
              onChange={handleChange}
              className="accent-black w-4 h-4"
            />
            <span className="text-sm font-medium">Available</span>
          </label>
        </div>

        {/* Images section */}
        <div>
          <p className="font-semibold mb-2">Uploaded Images (Max 6):</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {form.images?.map((img, index) => (
              <div
                key={index}
                className="relative group border border-black rounded overflow-hidden"
              >
                <img
                  src={img}
                  alt={`Uploaded ${index}`}
                  className="w-full h-28 object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleImageDelete(index)}
                  className="absolute top-1 right-1 p-1 bg-white border border-black rounded-full text-red-600 hover:bg-red-100"
                  title="Delete image"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            disabled={uploading}
            className="w-full border-2 border-black px-3 py-2 rounded-sm bg-[#fdfdfd] shadow-[2px_2px_0px_#000] mt-2"
          />
          {uploading && (
            <Loader2 className="w-5 h-5 animate-spin mt-2 text-black" />
          )}
        </div>

        <div className="flex justify-between items-center">
          <button
            type="submit"
            disabled={updating}
            className="bg-black text-white px-6 py-2 font-semibold border-2 border-black rounded shadow-[2px_2px_0px_#000] hover:bg-[#fffbea] hover:text-black transition"
          >
            {updating ? "Updating..." : "Update Property"}
          </button>

          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-6 py-2 font-semibold border-2 border-black rounded shadow-[2px_2px_0px_#000] hover:bg-[#fffbea] hover:text-black transition"
          >
            Delete Property
          </button>
        </div>
      </form>
    </section>
  );
};

export default EditProperty;
