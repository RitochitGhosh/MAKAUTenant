import axios from "axios";
import { CheckCircle, Loader2, LogOut, Trash2, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import ConfirmDeleteModal from "../components/confirmAccountDelete";
import {
  signOut,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/user/userSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const user = currentUser?.data ?? currentUser;
  
  

  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    password: "",
    avatar: user?.avatar || "",
  });
  const [file, setFile] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [fileUploadError, setFileUploadError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  useEffect(() => {
    if (file) handleFileUpload(file);
  }, [file]);

  const handleFileUpload = async (file) => {
    setFileUploadError("");
    setUploadProgress(0);

    try {
      // Prepare cloudinary for image upload
      const formDataToUpload = new FormData();
      formDataToUpload.append("file", file);
      formDataToUpload.append(
        "upload_preset",
        import.meta.env.VITE_CLOUDINARY_UNSIGNED_PRESET || "makautenant"
      );

      // Upload image to Cloudinary
      const cloudinaryRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/image/upload`,
        formDataToUpload,
        {
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percent);
          },
        }
      );

      // Get image url from cloudinay
      const imageUrl = cloudinaryRes.data.secure_url;
      console.log("Image url: ", imageUrl);
      setFormData((prev) => ({ ...prev, avatar: imageUrl }));
      setUploadProgress(100);
      setUploadComplete(true); // ✅ show success

      setTimeout(() => {
        setUploadComplete(false); // ✅ reset after 3 sec
      }, 3000);

      setFile(undefined);
    } catch (error) {
      console.error("File upload error:", error);
      setFileUploadError("Failed to upload image. Please try again.");
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      dispatch(updateUserStart());

      const res = await fetch(`/api/user/update/${user._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.status !== "success") {
        dispatch(updateUserFailure(data.message || "Something went wrong"));
        toast.error(data.message || "Something went wrong!", {
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

      toast.success("Profile updated!", {
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

      dispatch(updateUserSuccess(data.data));
      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }

    setLoading(false);
  };

  const handleSignOut = async (e) => {
    e.preventDefault();

    try {
      await fetch("/api/auth/sign-out", {
        method: "POST",
        credentials: "include",
      });

      toast.success("Signed out!", {
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

      dispatch(signOut());
      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      console.log("Sign out failed: ", error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const res = await fetch(`/api/auth/delete/${user._id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (data.status !== "success") {
        return toast.error(data.message || "Failed to delete account.");
      }

      dispatch(signOut());

      toast.success("Account deleted successfully!", {
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
    } catch (error) {
      toast.error("Something went wrong!");
      console.error(error);
    }
  };

  const handleVerifyEmail = async () => {
    try {
      const res = await fetch("api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await res.json();
      if (data.status != "success") {
        return toast.error(data.message || "Something went wrong!");
      }

      toast.success("Redirecting to verification link!", {
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

      console.log("Awaited response from server: ", data);
      setTimeout(() => {
        navigate(`/verify-email/${user._id}/${data.data.verifyUrl}`); // FIX: Do not auto redirect, let the user do it from email
      }, 3000);
    } catch (err) {
      toast.error("Failed to send verification email", err);
    }
  };

  return (
    <div className="min-h-[calc(100vh-104px)] bg-[#fffbea] px-4 py-10 flex justify-center items-center">
      <div className="w-full max-w-2xl bg-white border-4 border-black rounded-sm shadow-[5px_5px_0px_0px_black] p-6 space-y-6">
        <h2 className="text-3xl font-extrabold text-black uppercase text-center tracking-tight">
          My Profile
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative p-[1.5px] rounded-full border-4 border-black bg-white shadow-[3px_3px_0px_0px_black]">
              <img
                src={formData.avatar}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover"
              />
              {user?.isVerified && (
                <CheckCircle className="absolute -top-2 -right-2 w-5 h-5 text-green-500 bg-white rounded-full border-2 border-black" />
              )}
            </div>
            <label className="flex items-center gap-2 text-sm font-semibold underline cursor-pointer">
              <Upload className="w-4 h-4 cursor-pointer" />
              Change Avatar
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
              />
            </label>

            {!user?.isVerified && (
              <button
                type="button"
                onClick={handleVerifyEmail}
                className="mt-2 text-xs px-3 py-1 border-2 border-black rounded-sm bg-yellow-100 hover:bg-yellow-200 shadow-[2px_2px_0px_0px_black] font-bold"
              >
                Verify Email
              </button>
            )}

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="w-full mt-2 border-2 border-black shadow-[2px_2px_0px_0px_black] h-3 rounded-sm bg-[#fdfdfd]">
                <div
                  className="h-full bg-black text-white text-xs flex items-center justify-center transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                >
                  {uploadProgress}%
                </div>
              </div>
            )}

            {uploadComplete && (
              <div className="mt-2 text-sm font-semibold px-3 py-1 bg-[#d9f99d] text-black border-2 border-black rounded-sm shadow-[2px_2px_0px_0px_black]">
                ✅ Upload Completed!
              </div>
            )}

            {fileUploadError && (
              <p className="text-red-600 text-sm font-semibold mt-1">
                {fileUploadError}
              </p>
            )}
          </div>

          {/* Username */}
          <div className="flex flex-col gap-1">
            <label htmlFor="username" className="font-bold text-sm">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="border-2 border-black px-3 py-2 rounded-sm bg-[#fdfdfd] shadow-[2px_2px_0px_0px_black] focus:outline-none"
              value={formData.username}
              onChange={handleChange}
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
              id="email"
              name="email"
              className="border-2 border-black px-3 py-2 rounded-sm bg-[#fdfdfd] shadow-[2px_2px_0px_0px_black] focus:outline-none"
              value={formData.email}
              onChange={handleChange}
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
              id="password"
              name="password"
              placeholder="••••••••"
              className="border-2 border-black px-3 py-2 rounded-sm bg-[#fdfdfd] shadow-[2px_2px_0px_0px_black] focus:outline-none"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* Update Button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-4 py-2 border-2 border-black rounded-sm shadow-[3px_3px_0px_0px_black] hover:bg-[#fffbea] hover:text-black transition-all font-semibold"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin w-4 h-4" />
                Updating...
              </span>
            ) : (
              "Update Profile"
            )}
          </button>

          {/* Delete & Signout Row */}
          <div className="flex items-center justify-between text-sm font-semibold text-gray-700">
            <button
              type="button"
              onClick={() => setShowConfirmModal(true)}
              className="flex items-center gap-1 text-red-600 hover:text-red-800 transition cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              Delete Profile
            </button>

            <button
              type="button"
              onClick={handleSignOut}
              className="flex items-center gap-1 text-black hover:text-gray-900 transition cursor-pointer"
            >
              <LogOut className="w-3 h-3" />
              Sign Out
            </button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-black"></div>
            </div>
            <div className="relative text-xs text-center bg-white px-2 w-fit mx-auto font-semibold">
              OR
            </div>
          </div>

          {/* Add Property */}
          <Link
            to="/add-property"
            className="block text-center bg-white text-black px-4 py-2 border-2 border-black rounded-sm shadow-[3px_3px_0px_0px_black] hover:bg-black hover:text-white transition-all font-semibold"
          >
            Add Property
          </Link>
        </form>
      </div>
      <ConfirmDeleteModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleDeleteAccount}
      />
    </div>
  );
};

export default Profile;
