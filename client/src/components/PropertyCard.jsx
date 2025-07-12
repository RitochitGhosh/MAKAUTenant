import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const PropertyCard = ({ property }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white border-2 border-black shadow-[3px_3px_0px_#000] rounded-md overflow-hidden"
    >
      <img
        src={property.images?.[0]}
        alt={property.name}
        className="w-full h-40 object-cover border-b border-black"
      />
      <div className="p-4">
        <h3 className="text-lg font-bold">{property.name}</h3>
        <p className="text-sm text-gray-600 truncate">{property.address}</p>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="font-semibold text-green-700">
            ₹{property.discountedPrice ?? property.regularPrice}
          </span>
          <span className="bg-black text-white px-2 py-0.5 rounded text-xs uppercase">
            {property.type}
          </span>
        </div>
        <Link
          to={`/property/${property._id}`}
          className="inline-block mt-3 text-sm underline font-semibold hover:text-blue-600"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
