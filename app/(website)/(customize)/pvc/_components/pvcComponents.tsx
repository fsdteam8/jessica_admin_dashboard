

"use client";

import React, { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

const PrivacyPolicy = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const queryClient = useQueryClient();
    const { data: session } = useSession();
    const token = session?.accessToken;

    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ align: [] }],
            ["link"],
            [{ color: [] }, { background: [] }],
            ["clean"],
        ],
    };

    // ✅ Fetch existing privacy policy (correctly using object, not array)
    const { data: existingData, isLoading } = useQuery({
        queryKey: ["privacy"],
        queryFn: async () => {
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/custom/privacy`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Corrected: res.data.data is an object, not array
            return res.data?.data ?? null;
        },
        enabled: !!token,
    });

    useEffect(() => {
        if (existingData) {
            setTitle(existingData.title || "");
            setDescription(existingData.description || "");
        }
    }, [existingData]);

    const mutation = useMutation({
        mutationFn: async (formData: { title: string; description: string }) => {
            const isUpdate = !!existingData && existingData._id;
            const url = isUpdate
                ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/custom/privacy/${existingData._id}`
                : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/custom/privacy`;

            const method = isUpdate ? "PUT" : "POST";

            const response = await axios({
                method,
                url,
                data: formData,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            return response.data;
        },
        onSuccess: (success) => {
            queryClient.invalidateQueries({ queryKey: ["privacy"] });
            toast.success( success.message || "Privacy Policy saved successfully!");
        },
        onError: (error) => {
            console.error("Error saving data:", error);
            toast.error(error.message || "Failed to save Privacy Policy.");
        },
    });

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const handleDescriptionChange = (value: string) => {
        setDescription(value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !description.trim()) {
            alert("Please fill out both Title and Description.");
            return;
        }

        mutation.mutate({ title, description });
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-5xl">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    Privacy Policy
                </h2>

                <form onSubmit={handleSubmit}>
                    {/* Title Field */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">
                            Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={handleTitleChange}
                            placeholder="Enter title"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Description Field */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">
                            Description
                        </label>
                        <ReactQuill
                            value={description}
                            onChange={handleDescriptionChange}
                            modules={modules}
                            className="bg-white rounded-lg"
                            placeholder="Write your privacy policy here..."
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="mt-6">
                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="w-full p-3 bg-[#23547B] text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
                        >
                            {mutation.isPending
                                ? "Saving..."
                                : existingData
                                    ? "Update"
                                    : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
