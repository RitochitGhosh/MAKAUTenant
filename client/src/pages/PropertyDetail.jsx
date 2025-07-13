import { Heart, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { setWishList } from "../redux/user/userSlice";

const PropertyDescription = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.user.wishlist);
  const isWishlisted = wishlist.some((item) => item._id === id);

  const handleAddToWishList = async () => {
    try {
      const res = await fetch(`/api/property/${id}`);
      const data = await res.json();

      if (data.status !== "success") {
        toast.error("Failed to add property to the wishlist!");
        return;
      }

      dispatch(setWishList(data.data));
      toast.success("Added to wishList");
    } catch (error) {
      console.error("error in ading to wishlist: ", error);
    }
  };

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await fetch(`/api/property/${id}`);
        const data = await res.json();
        if (data.status === "success") setProperty(data.data);
      } catch (err) {
        console.error("Failed to load property:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-6 h-6 animate-spin text-black" />
      </div>
    );
  }

  if (!property)
    return (
      <p className="text-center text-gray-500 py-10">Property not found</p>
    );

  const {
    name,
    description,
    city,
    state,
    address,
    pincode,
    images,
    bedRooms,
    bathRooms,
    regularPrice,
    discountedPrice,
    type,
    owner,
    contactNo,
  } = property;

  const isMonthly = type === "rent" || type === "hostel" || type === "pg";
  const priceText = `₹${discountedPrice.toLocaleString()}${
    isMonthly ? " / month" : ""
  }`;

  return (
    <div className="bg-[#fffbea] min-h-screen px-4 py-8 md:py-12">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Cover Image */}
        <div className="relative">
          <img
            src={images[0]}
            alt="cover"
            className="w-full aspect-[4/2] object-cover rounded-md border-2 border-black shadow-[4px_4px_0px_#000]"
          />
          <div className="absolute bottom-4 right-4 bg-black text-white text-sm font-semibold px-4 py-2 rounded-md shadow-lg">
            {priceText}
          </div>
        </div>

        {/* Gallery */}
        <div className="hidden md:grid grid-cols-3 gap-4">
          {images.slice(1).map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`img-${i}`}
              className="w-full aspect-[4/3] object-cover rounded-md border-2 border-black shadow-[2px_2px_0px_#000]"
            />
          ))}
        </div>

        {/* Mobile Gallery */}
        <div className="md:hidden flex gap-4 overflow-x-auto pb-2">
          {images.slice(1).map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`img-${i}`}
              className="h-32 w-48 flex-shrink-0 object-cover rounded-md border-2 border-black shadow-[2px_2px_0px_#000]"
            />
          ))}
        </div>

        {/* Main Section */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Property Info */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold uppercase tracking-wide mb-1">
                  {name}
                </h1>
                <p className="text-gray-700 font-medium text-sm">
                  {address}, {city}, {state} - {pincode}
                </p>
              </div>

              {/* Wishlist */}
              <button
                onClick={handleAddToWishList}
                disabled={isWishlisted}
                className={`flex items-center gap-1 px-3 py-[6px] text-sm border-2 rounded-sm font-semibold shadow-[2px_2px_0px_#000] transition ${
                  isWishlisted
                    ? "bg-gray-200 border-gray-400 text-gray-500 cursor-not-allowed"
                    : "bg-white border-black text-black hover:bg-black hover:text-white"
                }`}
              >
                <Heart className="w-4 h-4" />
                {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm font-semibold">
              <div>
                <span className="block text-gray-600">Discounted Price</span>
                {priceText}
              </div>
              <div>
                <span className="block text-gray-600">Original Price</span>
                <span className="text-red-500 line-through">
                  ₹{regularPrice.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="block text-gray-600">Bedrooms</span>
                {bedRooms}
              </div>
              <div>
                <span className="block text-gray-600">Bathrooms</span>
                {bathRooms}
              </div>
              <div>
                <span className="block text-gray-600">Type</span>
                <span className="capitalize">{type}</span>
              </div>
            </div>

            <div className="text-base leading-relaxed bg-white border-2 border-black p-4 rounded-md shadow-[2px_2px_0px_#000]">
              <h3 className="font-bold mb-2 text-lg">Property Description</h3>
              <p className="text-gray-800">{description}</p>
            </div>
          </div>

          {/* Owner Info */}
          <div className="bg-white border-2 border-black p-6 rounded-md shadow-[3px_3px_0px_#000] space-y-5">
            <div className="flex items-center gap-4">
              <img
                src={owner?.avatar}
                alt="Owner"
                className="w-16 h-16 rounded-full border border-black shadow-[1px_1px_0px_#000]"
              />
              <div>
                <p className="font-bold text-base">{owner?.name}</p>
                <p className="text-xs text-gray-600">{owner?.email}</p>
              </div>
            </div>

            <div className="text-sm font-medium">
              <span className="text-gray-600">📞 Contact No:</span>{" "}
              <span className="ml-1">{contactNo}</span>
            </div>

            <button className="w-full text-sm font-semibold bg-black text-white py-2 rounded-sm border-2 border-black shadow-[2px_2px_0px_#000] hover:bg-[#fffbea] hover:text-black transition">
              Contact Owner
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDescription;
