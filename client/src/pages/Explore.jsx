import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FilterSidebar from "../components/FilterSidebar";
import PropertyCard from "../components/PropertyCard";
import { Loader2 } from "lucide-react";

const Explore = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const apiUrl = `/api/property?${searchParams.toString()}`;

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters to pass into <FilterSidebar />
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    city: "",
    location: "",
    bedRooms: "",
    bathRooms: "",
    furnished: false,
    isAvailable: false,
    type: "",
  });

  // Fetch properties whenever search params change
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const res = await fetch(apiUrl);
        const data = await res.json();
        if (data.status === "success") {
          setProperties(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch properties:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [location.search]);

  // Convert filters to query params and navigate
  const handleApplyFilters = (filtersToApply) => {
    const params = new URLSearchParams();

    Object.entries(filtersToApply).forEach(([key, value]) => {
      if (value !== "" && value !== false && value !== null) {
        params.set(key, value);
      }
    });

    navigate(`/explore?${params.toString()}`);
  };

  return (
    <section className="flex flex-col lg:flex-row max-w-7xl mx-auto px-4 py-8 gap-8">
      {/* Filters Sidebar (left on desktop, top on mobile) */}
      <FilterSidebar
        filters={filters}
        setFilters={setFilters}
        onApply={handleApplyFilters}
      />

      {/* Property list */}
      <div className="flex-1">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-6 h-6 animate-spin text-black" />
          </div>
        ) : properties.length === 0 ? (
          <p className="text-center text-gray-500">No properties found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((p) => (
              <PropertyCard key={p._id} property={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Explore;
