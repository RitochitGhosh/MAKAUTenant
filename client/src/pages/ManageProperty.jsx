import { Edit3, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const ManageProperties = () => {
  const { currentUser } = useSelector((state) => state.user);
  const userId = currentUser?.data?._id || currentUser?._id;

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    try {
      const res = await fetch(`/api/property/owner/${userId}`);
      const data = await res.json();
      if (data.status === "success") {
        setProperties(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch properties", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchProperties();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-6 h-6 animate-spin text-black" />
      </div>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-extrabold uppercase tracking-wider mb-6">
        Manage Your Properties
      </h2>

      {properties.length === 0 ? (
        <p className="text-center text-gray-500 font-medium py-10">
          You haven’t listed any properties yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div
              key={property._id}
              className="bg-white border-2 border-black shadow-[3px_3px_0px_#000] rounded-md overflow-hidden"
            >
              <img
                src={property.images?.[0]}
                alt={property.name}
                className="w-full h-40 object-cover border-b border-black"
              />
              <div className="p-4 space-y-2">
                <h3 className="text-lg font-bold">{property.name}</h3>
                <p className="text-sm text-gray-600">
                  {property.city}, {property.state}
                </p>

                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-green-700">
                    ₹{property.discountedPrice ?? property.regularPrice}
                  </span>
                  <span className="bg-black text-white px-2 py-0.5 rounded text-xs uppercase">
                    {property.type}
                  </span>
                </div>

                <div className="flex justify-end items-center mt-3">
                  <Link
                    to={`/edit-property/${property._id}`}
                    className="text-sm flex items-center gap-1 underline font-semibold"
                  >
                    <Edit3 className="w-4 h-4" /> Edit
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ManageProperties;
