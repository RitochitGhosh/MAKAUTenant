import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const PropertyCard = ({ property }) => {
  motion
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white border-2 border-black shadow-[4px_4px_0px_#000] rounded-md overflow-hidden transition-all duration-200"
    >
      {/* Top Bar (Apple-style Dots) */}
      <div className="flex items-center gap-2 px-3 py-1 border-b border-black bg-[#f5f5f5]">
        <span className="w-3 h-3 rounded-full bg-red-500 border border-black"></span>
        <span className="w-3 h-3 rounded-full bg-yellow-400 border border-black"></span>
        <span className="w-3 h-3 rounded-full bg-green-500 border border-black"></span>
      </div>

      {/* Cover Image */}
      <img
        src={property.images?.[0]}
        alt={property.name}
        className="w-full h-40 object-cover border-b border-black"
      />

      {/* Content */}
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-extrabold uppercase tracking-wide line-clamp-1">
          {property.name}
        </h3>

        <p className="text-sm text-gray-700 line-clamp-1">{property.address}</p>

        <div className="flex items-center justify-between text-sm font-semibold mt-2">
          <span className="text-green-700">
            ₹{property.discountedPrice?.toLocaleString() ?? property.regularPrice?.toLocaleString()}
          </span>
          <span className="bg-black text-white px-2 py-[2px] rounded-sm text-xs uppercase tracking-wide">
            {property.type}
          </span>
        </div>

        <Link
          to={`/property/${property._id}`}
          className="inline-block text-sm underline underline-offset-2 font-semibold"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
