import GoogleLogo from "../assets/google-logo.svg";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "@firebase/auth";
import { app } from "../firebase";

import { useDispatch } from "react-redux";
import { signInFailure, signInSuccess } from "../redux/user/userSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });

      const data = await res.json();
      dispatch(signInSuccess(data));

      if (data.status !== "success") {
        dispatch(signInFailure(data.message || "Something went wrong"))
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

      setTimeout(() => navigate("/"), 1000);

    //   console.log(result);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      className="flex items-center justify-center gap-3 bg-white px-4 py-2 border-2 border-black rounded-sm shadow-[3px_3px_0px_0px_black] hover:bg-[#fffbea] transition-all cursor-pointer"
    >
      <img src={GoogleLogo} alt="Google" className="w-5 h-5" />
      <span className="font-semibold text-sm">Continue with Google</span>
    </button>
  );
}
