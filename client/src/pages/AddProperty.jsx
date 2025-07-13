import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Loader2, Upload } from "lucide-react";
import toast from "react-hot-toast";

const AddProperty = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const user = currentUser?.data ?? currentUser;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    regularPrice: "",
    discountedPrice: "",
    bedRooms: "",
    bathRooms: "",
    furnished: false,
    type: "rent",
    contactNo: "",
    images: [],
  });

  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? Number(value)
          : value,
    });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length + formData.images.length > 6)
      return toast.error("You can only upload up to 6 images.");

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
          return resData.secure_url;
        })
      );
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploaded],
      }));
      toast.success("Images uploaded!");
    } catch (err) {
      console.log(err);
      toast.error("Image upload failed");
    }
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.images.length === 0)
      return toast.error("Please upload at least one image");

    try {
      const res = await fetch("/api/property/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.status !== "success") throw new Error(data.message);

      toast.success("Property listed successfully!");
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Failed to add property");
    }
  };

  return (
    <div className="bg-[#fffbea] min-h-screen px-4 py-10 flex justify-center">
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8">
        {user && (
          <div className="block md:hidden mb-6 w-full">
            <div className="border-4 border-black bg-white p-4 rounded-md shadow-[4px_4px_0px_#000] space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-base font-extrabold uppercase tracking-wide">
                  {user.name}
                </div>
                {user.isVerified && (
                  <div className="flex items-center gap-1 text-green-700 font-bold text-xs border border-black bg-green-200 px-2 py-[1px] rounded-sm shadow-[1px_1px_0px_#000]">
                    Verified
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414L8.414 15H7l-3.707-3.707a1 1 0 011.414-1.414L7 12.586l8.293-8.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>

              <p className="text-sm text-gray-700">{user.email}</p>
              <p className="text-sm font-medium">
                City:{" "}
                <span className="bg-yellow-300 border border-black px-2 py-[1px] rounded-sm shadow-[1px_1px_0px_#000]">
                  {user.city}
                </span>
              </p>

              <div className="text-xs text-gray-600 grid grid-cols-2 gap-x-2">
                <p>
                  Joined:{" "}
                  <span className="text-black font-semibold">
                    {new Date(user.createdAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </p>
                <p>
                  Updated:{" "}
                  <span className="text-black font-semibold">
                    {new Date(user.updatedAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </p>
              </div>

              <div className="text-xs text-gray-500 font-semibold pt-2 border-t border-black">
                Current Time:{" "}
                <span className="text-black">
                  {new Date().toLocaleTimeString("en-IN", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="w-full md:w-2/3 bg-white border-4 border-black shadow-[6px_6px_0px_#000] p-6 rounded-md">
          <h2 className="text-2xl font-extrabold uppercase text-center mb-6">
            Add New Property
          </h2>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Name */}
            <div className="flex flex-col">
              <label htmlFor="name" className="font-bold text-sm mb-1">
                Property Name
              </label>
              
              <input
                type="text"
                spellCheck={false}
                id="name"
                name="name"
                placeholder="2 BHK in Salt Lake"
                value={formData.name}
                onChange={handleChange}
                required
                className="border-2 border-black px-3 py-2 rounded-sm bg-[#fdfdfd] shadow-[2px_2px_0px_#000] focus:outline-none"
              />
            </div>

            {/* Address, City */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label htmlFor="address" className="font-bold text-sm mb-1">
                  Address
                </label>
                <input
                  type="text"
                  spellCheck={false}
                  id="address"
                  name="address"
                  placeholder="Near Tech Park, Sector V"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="border-2 border-black px-3 py-2 rounded-sm bg-[#fdfdfd] shadow-[2px_2px_0px_#000] focus:outline-none"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="city" className="font-bold text-sm mb-1">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  placeholder="Kolkata"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="border-2 border-black px-3 py-2 rounded-sm bg-[#fdfdfd] shadow-[2px_2px_0px_#000] focus:outline-none"
                />
              </div>
            </div>

            {/* State, Pincode, Contact */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "State", name: "state", placeholder: "West Bengal" },
                { label: "Pincode", name: "pincode", placeholder: "700091" },
                {
                  label: "Contact No",
                  name: "contactNo",
                  placeholder: "9876543210",
                },
              ].map(({ label, name, placeholder }) => (
                <div key={name} className="flex flex-col">
                  <label htmlFor={name} className="font-bold text-sm mb-1">
                    {label}
                  </label>
                  <input
                    type="text"
                    id={name}
                    name={name}
                    placeholder={placeholder}
                    value={formData[name]}
                    onChange={handleChange}
                    required
                    className="border-2 border-black px-3 py-2 rounded-sm bg-[#fdfdfd] shadow-[2px_2px_0px_#000] focus:outline-none"
                  />
                </div>
              ))}
            </div>

            {/* Price & Rooms */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  name: "regularPrice",
                  label: "Regular Price",
                  placeholder: "e.g. 15000",
                },
                {
                  name: "discountedPrice",
                  label: "Discounted Price",
                  placeholder: "e.g. 12000",
                },
                { name: "bedRooms", label: "Bedrooms", placeholder: "e.g. 2" },
                {
                  name: "bathRooms",
                  label: "Bathrooms",
                  placeholder: "e.g. 1",
                },
              ].map(({ name, label, placeholder }) => (
                <div key={name} className="flex flex-col">
                  <label htmlFor={name} className="font-bold text-sm mb-1">
                    {label}
                  </label>
                  <input
                    type="number"
                    id={name}
                    name={name}
                    placeholder={placeholder}
                    value={formData[name]}
                    onChange={handleChange}
                    required
                    className="border-2 border-black px-3 py-2 rounded-sm bg-[#fdfdfd] shadow-[2px_2px_0px_#000] focus:outline-none"
                  />
                </div>
              ))}
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="font-bold text-sm mb-1 block"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                placeholder="Tell us about amenities, location advantage, nearby markets, etc."
                value={formData.description}
                onChange={handleChange}
                required
                className="w-full border-2 border-black px-3 py-2 rounded-sm bg-[#fdfdfd] shadow-[2px_2px_0px_#000] focus:outline-none"
              ></textarea>
            </div>

            {/* Type & Furnished */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label htmlFor="type" className="font-bold text-sm mb-1">
                  Property Type
                </label>
                <select
                  name="type"
                  id="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="border-2 border-black px-3 py-2 rounded-sm bg-[#fdfdfd] shadow-[2px_2px_0px_#000]"
                >
                  <option value="rent">Rent</option>
                  <option value="sale">Sale</option>
                  <option value="hostel">Hostel</option>
                  <option value="pg">PG</option>
                </select>
              </div>

              <div className="flex items-center gap-3 mt-6 md:mt-0">
                <input
                  type="checkbox"
                  name="furnished"
                  id="furnished"
                  checked={formData.furnished}
                  onChange={handleChange}
                />
                <label htmlFor="furnished" className="font-semibold">
                  Furnished
                </label>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="font-bold text-sm mb-1 block">
                Upload Images (max 6)
              </label>
              <p className="text-xs text-gray-600 font-medium mb-2">
                First image will be used as <strong>cover photo</strong>
              </p>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="w-full border-2 border-black px-3 py-2 rounded-sm bg-[#fdfdfd] shadow-[2px_2px_0px_#000]"
              />
              {uploading && (
                <Loader2 className="w-5 h-5 animate-spin mt-2 text-black" />
              )}
            </div>

            {/* Image Preview */}
            {formData.images.length > 0 && (
              <div>
                <h3 className="text-sm font-bold mb-2">Preview:</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {formData.images.map((url, i) => (
                    <div
                      key={i}
                      className="relative border-2 border-black rounded-sm shadow-[2px_2px_0px_#000]"
                    >
                      <img
                        src={url}
                        alt={`uploaded-${i}`}
                        className="w-full h-24 object-cover rounded-sm"
                      />
                      {i === 0 && (
                        <span className="absolute top-1 left-1 text-[10px] font-bold bg-yellow-300 px-1 py-[1px] border border-black shadow-[1px_1px_0px_#000] rounded-sm">
                          Cover
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full bg-black text-white px-4 py-3 border-2 border-black rounded-sm shadow-[3px_3px_0px_#000] hover:bg-[#fffbea] hover:text-black transition font-semibold"
              >
                Submit Property
              </button>
            </div>
          </form>
        </div>

        {user && (
          <div className="hidden md:block w-full md:w-1/3 sticky top-20 self-start">
            <div className="border-4 border-black bg-white p-5 rounded-md shadow-[6px_6px_0px_#000] space-y-4">
              {/* Name + Verified */}
              <div className="flex items-center justify-between">
                <div className="text-lg font-extrabold uppercase tracking-wide">
                  {user.name}
                </div>
                {user.isVerified && (
                  <div className="flex items-center gap-1 text-green-700 font-bold text-sm border border-black bg-green-200 px-2 py-[2px] rounded-sm shadow-[1px_1px_0px_#000]">
                    <span className="text-xs">Verified</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414L8.414 15H7l-3.707-3.707a1 1 0 011.414-1.414L7 12.586l8.293-8.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Email */}
              <p className="text-sm font-medium text-gray-700 break-words">
                {user.email}
              </p>

              {/* City */}
              <p className="text-sm font-medium">
                City:{" "}
                <span className="bg-yellow-300 border border-black px-2 py-[1px] rounded-sm shadow-[1px_1px_0px_#000]">
                  {user.city}
                </span>
              </p>

              {/* Created + Updated */}
              <div className="text-xs font-medium text-gray-600 grid grid-cols-2 gap-x-2">
                <p>
                  Joined:{" "}
                  <span className="text-black font-semibold">
                    {new Date(user.createdAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </p>
                <p>
                  Updated:{" "}
                  <span className="text-black font-semibold">
                    {new Date(user.updatedAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </p>
              </div>

              {/* Current Time */}
              <div className="text-xs text-gray-500 font-semibold pt-2 border-t border-black">
                Current Time:{" "}
                <span className="text-black">
                  {new Date().toLocaleTimeString("en-IN", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddProperty;
