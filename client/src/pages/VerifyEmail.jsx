import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/user/userSlice";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

const VerifyEmail = () => {
  const { id, token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await fetch(`/api/auth/verify-email/${id}/${token}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();

        if (data.status !== "success") {
          toast.error(data.message || "Verification failed!");
          return navigate("/profile");
        }

        dispatch(setUser(data.data));

        toast.success("Email verified successfully!", {
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

        setTimeout(() => navigate("/profile"), 2000);
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong!");
        navigate("/login");
      }
    };

    verifyUser();
  }, [id, token, dispatch, navigate]);

  return (
    <section className="min-h-screen flex items-center justify-center px-4 bg-[#fffbea]">
      <div className="max-w-md w-full text-center p-6 rounded-md border-4 border-black bg-white shadow-[6px_6px_0px_#000]">
        <div className="flex justify-center mb-4">
          <Loader2 className="animate-spin w-8 h-8 text-black" />
        </div>
        <h2 className="text-2xl font-bold text-black tracking-tight uppercase">
          Verifying Email
        </h2>
        <p className="mt-2 text-sm font-medium text-gray-700">
          Please wait while we confirm your verification link...
        </p>
        <div className="mt-4 border-t border-black" />
        <p className="text-xs mt-3 text-gray-500 font-semibold">
          If this takes too long, try refreshing or check your email again.
        </p>
      </div>
    </section>
  );
};

export default VerifyEmail;
