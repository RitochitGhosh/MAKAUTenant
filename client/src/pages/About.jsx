import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function AboutPage() {
  motion
  return (
    <section className="min-h-screen px-6 py-16 bg-[#fefefe] flex flex-col justify-center items-center">
      {/* Window Header */}
      <div className="w-full max-w-5xl border-2 border-black shadow-[5px_5px_0px_#000] rounded-md bg-white p-6">
        <div className="flex gap-2 mb-4">
          <span className="w-3 h-3 bg-red-500 rounded-full" />
          <span className="w-3 h-3 bg-yellow-500 rounded-full" />
          <span className="w-3 h-3 bg-green-500 rounded-full" />
        </div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-6"
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-wider border-b-2 border-black pb-2">
            About <span className="text-blue-600">MAKAUTenant</span>
          </h1>

          <p className="text-lg font-medium text-gray-800">
            <strong>MAKAUTenant</strong> is a student-first property discovery platform designed to ease the struggle of finding the perfect place to live when moving to a new city for education or work.
          </p>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-[#fffad1] border-2 border-black shadow-[3px_3px_0px_#000] rounded-md p-4"
          >
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              <Sparkles className="text-yellow-600" size={20} />
              Why MAKAUTenant?
            </h3>
            <ul className="list-disc list-inside text-gray-800 font-medium space-y-1">
              <li>📍 Find hostels, PGs, and rooms near your university or workplace.</li>
              <li>📸 Explore detailed listings with real photos and descriptions.</li>
              <li>🖤 Wishlist properties for comparison and later viewing.</li>
              <li>📞 Contact owners directly with verified contact info.</li>
              <li>✅ Avoid scams – all listings are added by registered users.</li>
            </ul>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-[#e6fcf5] border-2 border-black shadow-[3px_3px_0px_#000] rounded-md p-4"
          >
            <h3 className="text-xl font-bold mb-2">Problem We Solve</h3>
            <p className="text-gray-700 font-medium">
              Every year, thousands of students migrate from small towns and cities to major educational hubs like Kolkata, Delhi, Pune, and Bangalore. They often face:
            </p>
            <ul className="list-disc list-inside pl-4 mt-2 space-y-1 text-gray-700 font-medium">
              <li>Lack of verified PG/hostel options online</li>
              <li>Unreliable brokers and hidden charges</li>
              <li>Last-minute accommodation stress</li>
              <li>No platform designed **specifically for students**</li>
            </ul>
            <p className="mt-4 font-semibold">
              StayEase bridges this gap by giving them a student-centric home-search experience with verified data and useful tools.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-[#f1f1ff] border-2 border-black shadow-[3px_3px_0px_#000] rounded-md p-4"
          >
            <h3 className="text-xl font-bold mb-2">Quick Stats 📊</h3>
            <ul className="grid sm:grid-cols-2 gap-3 font-medium text-gray-700">
              <li>🔍 1000+ active property listings (expected growth)</li>
              <li>👥 500+ students already using the platform</li>
              <li>🧠 80% students prefer pre-verified hostels over brokered ones</li>
              <li>⏱️ Reduces search time from 5 days to under 3 hours</li>
            </ul>
          </motion.div>

          <div className="text-sm text-gray-500 pt-6 border-t border-black mt-8">
            Built with ❤️ by developers who know the struggle. We're here to help every student find a home, not just a room.
          </div>
        </motion.div>
      </div>
    </section>
  );
}
