"use client";

import React, { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import axios from "axios";
import { useSession } from "next-auth/react";

const Document = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [country, setCountry] = useState("");
    const [email, setEmail] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const queryClient = useQueryClient();
    const { data: session } = useSession();
    const token = session?.accessToken || "";

    // Fetch existing data
    const { data: response, isLoading } = useQuery({
        queryKey: ["document"],
        queryFn: async () => {
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/custom/legal-document`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            return res.data;
        },
        retry: false,
    });

    const existingData = response?.data;
    console.log(existingData);
    useEffect(() => {
        if (existingData) {
            setTitle(existingData.title || "");
            setDescription(existingData.description || "");
            setCountry(existingData.country || "");
            setEmail(existingData?.email || "");
            if (existingData.image) {
                setImagePreview(existingData.image);
            }
        }
    }, [existingData]);

    const mutation = useMutation({
        mutationFn: async (formData: FormData) => {
            const isUpdate = !!existingData;
            const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/custom/legal-document/${isUpdate ? existingData._id : ""}`;
            const method = isUpdate ? "PUT" : "POST";

            const res = await axios({
                method,
                url,
                data: formData,
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["document"] });
            alert("Data saved successfully!");
        },
        onError: (err) => {
            console.error("Error saving data:", err);
            alert("Failed to save data. Please try again.");
        },
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setImage(file);

        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        } else {
            setImagePreview(null);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("country", country);
        formData.append("email", email);
        if (image) {
            formData.append("image", image);
        }
        mutation.mutate(formData);
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    Document Section
                </h2>

                <form onSubmit={handleSubmit}>
                    {/* Title */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter title"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter description"
                            rows={5}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Country */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">Country</label>
                        <input
                            type="text"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            placeholder="Enter country"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">Email</label>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter Email"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Single Image Upload */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full p-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#23547B] file:text-white hover:file:bg-blue-600"
                        />
                        {imagePreview && (
                            <div className="mt-4 w-full h-52 relative">
                                <Image
                                    src={imagePreview}
                                    alt="Image Preview"
                                    fill
                                    unoptimized
                                    className="object-cover rounded-lg shadow-md"
                                />
                            </div>
                        )}
                    </div>

                    {/* Submit */}
                    <div className="mt-6">
                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="w-full p-3 bg-[#23547B] text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
                        >
                            {mutation.isPending ? "Saving..." : existingData ? "Update" : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Document;
