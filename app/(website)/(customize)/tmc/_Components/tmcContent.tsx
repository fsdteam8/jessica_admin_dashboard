

"use client";

import React, { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

const TermsAndConditions = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [recordId, setRecordId] = useState<string | null>(null);
    const queryClient = useQueryClient();
    const token = useSession().data?.accessToken || "";

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

    const { data: responseData, isLoading } = useQuery({
        queryKey: ["terms"],
        queryFn: async () => {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/custom/terms`);
            return res.data;
        },
    });

    useEffect(() => {
        if (responseData?.data) {
            const { title, description, _id } = responseData.data;
            setTitle(title || "");
            setDescription(description || "");
            setRecordId(_id || null);
        }
    }, [responseData]);

    const mutation = useMutation({
        mutationFn: async (formData: { title: string; description: string }) => {
            const isUpdate = !!recordId;
            const url = isUpdate
                ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/custom/terms/${recordId}`
                : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/custom/terms`;
            const method = isUpdate ? "PUT" : "POST";

            const res = await axios({
                method,
                url,
                data: formData,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            return res.data;
        },
        onSuccess: (success) => {
            queryClient.invalidateQueries({ queryKey: ["terms"] });
            toast.success(success.message || "Data saved successfully!");
        },
        onError: (error) => {
            console.error("Error saving data:", error);
            toast.error(error.message || "Failed to save data.");
        },
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutation.mutate({ title, description });
    };

    if (isLoading) return <div className="text-center py-10 text-gray-600">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-4xl">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Terms and Conditions</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter title"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <div className="bg-white rounded-lg overflow-hidden border border-gray-300">
                            <ReactQuill
                                value={description}
                                onChange={setDescription}
                                modules={modules}
                                placeholder="Write your terms and conditions here..."
                                className="h-96"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="w-full bg-[#23547B] text-white py-3 rounded-lg text-sm font-semibold transition duration-300 hover:bg-[#1e4666] disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {mutation.isPending ? "Saving..." : recordId ? "Update Terms" : "Create Terms"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TermsAndConditions;
