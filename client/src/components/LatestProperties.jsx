import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import PropertyCard from "./PropertyCard";

export default function LatestProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch("/api/property");
        const data = await res.json();
        if (data.status === "success") {
          setProperties(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({
      left: -350,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({
      left: 350,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full max-w-6xl mx-auto pt-10 relative">
      <h3 className="text-xl font-extrabold uppercase mb-6 tracking-wider border-b-2 border-black pb-2">
        Latest Properties
      </h3>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin w-6 h-6 text-black" />
        </div>
      ) : properties.length > 0 ? (
        <div className="relative group flex justify-center items-center">
          {/* Scroll Buttons */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white border-2 border-black p-2 z-10 rounded-full shadow-[3px_3px_0px_#000] hover:bg-black hover:text-white transition hidden md:inline-flex"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white border-2 border-black p-2 z-10 rounded-full shadow-[3px_3px_0px_#000] hover:bg-black hover:text-white transition hidden md:inline-flex"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Scrollable Container */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth px-2 md:px-4 py-4 scrollbar-hide"
            style={{ scrollBehavior: "smooth" }}
          >
            {properties.map((property) => (
              <div
                key={property._id}
                className="flex-shrink-0 w-[280px] sm:w-[320px] md:w-[340px] lg:w-[360px]"
              >
                <PropertyCard property={property} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500 font-medium py-10">
          No properties found. Try adjusting filters or check back later.
        </p>
      )}
    </section>
  );
}
