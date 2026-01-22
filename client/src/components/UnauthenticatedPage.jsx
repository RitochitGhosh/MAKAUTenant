import { Link } from "react-router-dom";
import { Lock } from "lucide-react";

const UnauthenticatedPage = () => {
  return (
    <div className="min-h-[calc(100vh-104px)] flex items-center justify-center bg-[#ffa797] px-4 py-12">
      <div className="max-w-lg w-full bg-white border-4 border-black p-8 sm:p-10 rounded-sm shadow-[5px_5px_0px_0px_black] text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full border-4 border-black bg-[#fdfdfd] shadow-[3px_3px_0px_0px_black]">
            <Lock className="size-8 sm:size-10 text-black" />
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-black uppercase tracking-tight mb-3">
          Access Denied
        </h2>

        <p className="text-sm sm:text-base text-black font-medium mb-6">
          You must be signed in to view this page. Please sign in or create an account.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            to="/sign-in"
            className="w-full sm:w-auto bg-black text-white px-5 py-2 border-2 border-black rounded-sm text-sm font-semibold shadow-[3px_3px_0px_0px_black] hover:bg-[#fffbea] hover:text-black transition-all"
          >
            Sign In
          </Link>
          <Link
            to="/sign-up"
            className="w-full sm:w-auto bg-white text-black px-5 py-2 border-2 border-black rounded-sm text-sm font-semibold shadow-[3px_3px_0px_0px_black] hover:bg-[#fffbea] transition-all"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthenticatedPage;
