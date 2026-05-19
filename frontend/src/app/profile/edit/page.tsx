"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [bio, setBio] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [profilePicture, setProfilePicture] = useState("");

  async function loadProfile() {
    try {
      const response = await api.get("/users/me");

      setName(response.data.name || "");
      setCountry(response.data.country || "");
      setBio(response.data.bio || "");
      setProfilePicture(
        response.data.profile_picture || ""
      );
    } catch (error) {
      console.error(error);
      alert("Failed to load profile");
    }
  }

  async function handleUploadImage() {
    if (!selectedFile) {
      alert("Select an image first");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await api.post(
        "/users/upload-profile-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setProfilePicture(
        response.data.profile_picture
      );

      alert("Profile picture uploaded successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to upload image");
    }
  }

  async function handleUpdateProfile() {
    try {
      await api.put("/users/me", {
        name,
        country,
        bio,
        profile_picture: profilePicture,
      });

      alert("Profile updated successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Failed to update profile");
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">
            Edit Profile
          </h1>

          <Link
            href="/dashboard"
            className="border border-white px-5 py-2 rounded-xl font-bold"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="space-y-5 border border-gray-800 rounded-2xl p-8">

          {profilePicture && (
            <img
              src={profilePicture}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border border-gray-700"
            />
          )}

          <input
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            placeholder="Name"
            className="w-full p-4 bg-zinc-900 rounded-xl"
          />

          <input
            value={country}
            onChange={(e) =>
              setCountry(e.target.value)
            }
            placeholder="Country"
            className="w-full p-4 bg-zinc-900 rounded-xl"
          />

          <textarea
            value={bio}
            onChange={(e) =>
              setBio(e.target.value)
            }
            placeholder="Bio"
            className="w-full p-4 bg-zinc-900 rounded-xl min-h-[140px]"
          />

          <div className="space-y-3">
            <p className="font-bold">
              Upload Profile Picture
            </p>

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setSelectedFile(
                  e.target.files?.[0] || null
                )
              }
              className="w-full"
            />

            <button
              type="button"
              onClick={handleUploadImage}
              className="border border-white px-5 py-2 rounded-xl font-bold"
            >
              Upload Image
            </button>
          </div>

          <button
            onClick={handleUpdateProfile}
            className="w-full bg-white text-black py-4 rounded-xl font-bold"
          >
            Save Changes
          </button>
        </div>
      </div>
    </main>
  );
}