import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import PropertyCard from "./PropertyCard";

export default function LocalProperties() {
  const { currentUser } = useSelector((state) => state.user);
  const user = currentUser?.data ?? currentUser;

  const city = user?.city || "Kolkata";
  const isGuest = !user;

  const [localProperties, setLocalProperties] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const LIMIT = 9;

  const fetchLocal = async (pageNumber) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/property?city=${city}&page=${pageNumber}&limit=${LIMIT}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
      });
      const data = await res.json();

      if (data.status === "success") {
        const fetched = data.data;

        if (fetched.length < LIMIT) setHasMore(false);

        setLocalProperties((prev) => [...prev, ...fetched]);
      }
    } catch (err) {
      console.error("Local property fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Reset when city changes
    setLocalProperties([]);
    setPage(1);
    setHasMore(true);

    
    fetchLocal(1);
  }, [city]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchLocal(nextPage);
  };

  return (
    <section className="w-full max-w-6xl mx-auto pt-12 px-2">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <h3 className="text-xl font-extrabold uppercase tracking-wider flex items-center gap-2">
          Properties In
          <span className="px-2 py-1 bg-yellow-300 border border-black shadow-[2px_2px_0px_#000] rounded-sm text-black text-sm">
            {city}
          </span>
        </h3>

        {isGuest && (
          <p className="text-sm border border-black px-3 py-1 rounded-sm bg-white shadow-[2px_2px_0px_#000] font-medium">
            You're seeing properties in <strong>Kolkata</strong>.{" "}
            <span className="text-blue-600 underline cursor-pointer">Sign in</span> to get personalized listings.
          </p>
        )}
      </div>

      {localProperties.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {localProperties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="flex justify-center mt-10">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="bg-black text-white px-6 py-2 border-2 border-black rounded-sm shadow-[3px_3px_0px_#000] hover:bg-[#fffbea] hover:text-black transition font-semibold"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Loading...
                  </span>
                ) : (
                  "Load More"
                )}
              </button>
            </div>
          )}
        </>
      ) : loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin w-6 h-6 text-black" />
        </div>
      ) : (
        <p className="text-center text-gray-500 font-medium py-10">
          No properties found in {city}. Check back soon!
        </p>
      )}
    </section>
  );
}
