import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import PropertyCard from "../components/PropertyCard";

const Home = () => {
  const { currentUser } = useSelector((state) => state.user);
  const user = currentUser?.data ?? currentUser;
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="bg-[#fffbea] text-black px-4 pb-20 pt-4">
      {/* HERO SECTION */}
      <section className="relative w-full max-w-6xl mx-auto pt-6 pb-20">
        <div className="bg-white border-4 border-black shadow-[6px_6px_0px_#000] rounded-md px-6 py-12 relative">
          {/* macOS dots */}
          <div className="absolute top-2 left-2 flex space-x-2">
            <span className="w-3 h-3 bg-red-500 rounded-full border border-black" />
            <span className="w-3 h-3 bg-yellow-400 rounded-full border border-black" />
            <span className="w-3 h-3 bg-green-500 rounded-full border border-black" />
          </div>

          {/* Heading */}
          <motion.h1
            className="text-4xl md:text-5xl font-extrabold tracking-tight text-center uppercase leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Find your <span className="underline decoration-4">Next Home</span>
          </motion.h1>

          {/* Description */}
          <p className="mt-4 text-center text-base md:text-lg font-medium text-gray-700 max-w-2xl mx-auto">
            {user ? (
              <>
                Welcome back, <span className="font-bold">{user.username}</span>{" "}
                — ready to find something amazing?
              </>
            ) : (
              <>
                Discover verified places to <b>rent</b>, <b>buy</b>, or{" "}
                <b>host</b> your own property.{" "}
                <Link
                  to="/register"
                  className="underline font-bold text-blue-600"
                >
                  Create your free account today!
                </Link>
              </>
            )}
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/explore"
              className="bg-black text-white px-6 py-2 border-2 border-black rounded-sm shadow-[3px_3px_0px_#000] hover:bg-white hover:text-black transition font-bold"
            >
              Explore Properties
            </Link>
            <Link
              to="/add-property"
              className="bg-white text-black px-6 py-2 border-2 border-black rounded-sm shadow-[3px_3px_0px_#000] hover:bg-black hover:text-white transition font-bold"
            >
              List Your Property
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURE HIGHLIGHTS */}
      <section className="w-full max-w-6xl mx-auto py-10">
        <h3 className="text-xl font-bold uppercase mb-6 text-center tracking-wider">
          Why Choose Us?
        </h3>
        <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-6">
          {[
            { label: "Verified Listings", color: "bg-green-200" },
            { label: "Affordable Options", color: "bg-yellow-200" },
            { label: "Trusted Owners", color: "bg-blue-200" },
            { label: "Fast Onboarding", color: "bg-pink-200" },
          ].map(({ label, color }, i) => (
            <motion.div
              key={i}
              className={`p-4 border-2 border-black shadow-[3px_3px_0px_#000] rounded-md text-center font-semibold ${color}`}
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              {label}
            </motion.div>
          ))}
        </div>
      </section>

      {/* PROPERTY LISTINGS */}
      <section className="w-full max-w-6xl mx-auto pt-10">
        <h3 className="text-xl font-bold uppercase mb-6 tracking-wider">
          Latest Properties
        </h3>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin w-6 h-6 text-black" />
          </div>
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 font-medium py-10">
            No properties found. Try adjusting filters or check back later.
          </p>
        )}
      </section>
    </div>
  );
};

export default Home;
