import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import PropertyCard from "../components/PropertyCard";
import { unsetWishList } from "../redux/user/userSlice.js";

const WishListPage = () => {
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.user.wishlist);

  const handleRemove = (id) => {
    dispatch(unsetWishList(id));
    toast.success("Removed from wishlist");

    if (wishlist.length - 1 === 0) {
      toast.success("Add items to your wishlist");
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-extrabold uppercase mb-6 tracking-wide">
        Your Wishlist
      </h2>

      {wishlist.length === 0 ? (
        <p className="text-center text-gray-500 text-lg mt-10">
          Your wishlist is empty.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((property) => (
            <div
              key={property._id}
              className="relative border-2 border-black rounded-md p-3 shadow-[3px_3px_0px_#000] bg-white"
            >
              <PropertyCard property={property} />

              {/* Remove Button */}
              <button
                onClick={() => handleRemove(property._id)}
                className="absolute top-2 right-2 bg-white border-2 border-black text-red-600 p-1 rounded-full shadow-[2px_2px_0px_#000] hover:bg-red-100 transition"
                title="Remove from wishlist"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default WishListPage;
