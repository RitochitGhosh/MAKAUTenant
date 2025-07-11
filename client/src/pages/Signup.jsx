import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GoogleLogo from "../assets/google-logo.svg";
import { Loader } from "lucide-react";
import { toast } from "react-hot-toast";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.status !== "success") {
        setError(data.message || "Something went wrong");
        toast.error(data.message || "Signup failed!", {
          style: {
            border: "2px solid black",
            boxShadow: "3px 3px 0 black",
            background: "#fffbea",
            color: "#000",
          },
          iconTheme: {
            primary: "black",
            secondary: "#fffbea",
          },
        });
        setLoading(false);
        return;
      }

      toast.success("Account created!", {
        style: {
          border: "2px solid black",
          boxShadow: "3px 3px 0 black",
          background: "#fffbea",
          color: "#000",
        },
        iconTheme: {
          primary: "black",
          secondary: "#fffbea",
        },
      });

      setFormData({ username: "", email: "", password: "" });
      setTimeout(() => navigate("/sign-in"), 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sm:min-h-[calc(100vh-104px)] bg-[#fffbea] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white border-4 border-black p-6 rounded-sm shadow-[5px_5px_0px_0px_black]">
        <h2 className="text-3xl font-extrabold mb-6 text-black uppercase tracking-tight text-center">
          Sign Up
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Username */}
          <div className="flex flex-col gap-1">
            <label htmlFor="username" className="font-bold text-sm">
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="johndoe"
              value={formData.username}
              onChange={handleChange}
              className="border-2 border-black px-3 py-2 rounded-sm focus:outline-none bg-[#fdfdfd] shadow-[2px_2px_0px_0px_black]"
              required
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="font-bold text-sm">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="john@mail.com"
              value={formData.email}
              onChange={handleChange}
              className="border-2 border-black px-3 py-2 rounded-sm focus:outline-none bg-[#fdfdfd] shadow-[2px_2px_0px_0px_black]"
              required
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="font-bold text-sm">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="border-2 border-black px-3 py-2 rounded-sm focus:outline-none bg-[#fdfdfd] shadow-[2px_2px_0px_0px_black]"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 font-semibold text-center -mt-2">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex items-center justify-center gap-2 bg-black text-white px-4 py-2 border-2 border-black rounded-sm shadow-[3px_3px_0px_0px_black] hover:bg-[#fffbea] hover:text-black transition-all cursor-pointer"
          >
            {loading && <Loader className="animate-spin size-4" />}
            Create Account
          </button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-black"></div>
            </div>
            <div className="relative text-xs text-center bg-white px-2 w-fit mx-auto font-semibold">
              OR
            </div>
          </div>

          <button
            type="button"
            disabled={loading}
            className="flex items-center justify-center gap-3 bg-white px-4 py-2 border-2 border-black rounded-sm shadow-[3px_3px_0px_0px_black] hover:bg-[#fffbea] transition-all cursor-pointer"
          >
            <img src={GoogleLogo} alt="Google" className="w-5 h-5" />
            <span className="font-semibold text-sm">Continue with Google</span>
          </button>

          <p className="text-xs text-center mt-5">
            Already have an account?{" "}
            <Link to="/sign-in" className="underline font-semibold">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
