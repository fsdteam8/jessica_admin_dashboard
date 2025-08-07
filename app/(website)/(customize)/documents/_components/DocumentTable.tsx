"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"; // adjust if you have a Button component

interface Document {
    _id: string;
    title: string;
    description: string;
    country: string;
    image: string;
}

const DocumentTable = () => {
    const { data: session } = useSession();
    const token = session?.accessToken || "";
    const queryClient = useQueryClient();
    const router = useRouter();
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const { data: response, isLoading, isError } = useQuery({
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
        enabled: !!token,
        retry: false,
    });

    const documents: Document[] = response?.data || [];

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            setDeletingId(id);
            const res = await axios.delete(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/custom/legal-document/${id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["document"] });
            setDeletingId(null);
        },
        onError: (error) => {
            console.error("Delete failed:", error);
            setDeletingId(null);
        },
    });

    if (isLoading)
        return (
            <div className="flex justify-center items-center h-40 text-gray-500 text-lg">
                Loading documents...
            </div>
        );
    if (isError)
        return (
            <div className="flex justify-center items-center h-40 text-red-500 text-lg">
                Failed to load documents.
            </div>
        );

    return (
        <div className=" mx-auto h-screen p-6 bg-white rounded-lg shadow-md">
            {/* Header with Title and Add Button */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                <h1 className="text-3xl font-semibold text-gray-800">Documents</h1>
                <Button
                    onClick={() => router.push("/documents/add")}
                    className="bg-[#23547B] hover:bg-[#29679b] text-white shadow-md transition"

                >
                    + Add Document
                </Button>
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {["Title", "Description", "Country", "Actions"].map((heading) => (
                                <th
                                    key={heading}
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    {heading}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                        {documents.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="px-6 py-8 text-center text-gray-400 italic text-sm"
                                >
                                    No documents found.
                                </td>
                            </tr>
                        ) : (
                            documents.map((doc) => (
                                <tr
                                    key={doc._id}
                                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                                        {doc.title}
                                    </td>
                                    <td className="px-6 py-4 whitespace-normal max-w-xs text-gray-700 text-sm">
                                        {doc.description.length > 80
                                            ? doc.description.slice(0, 77) + "..."
                                            : doc.description}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 text-sm">
                                        {doc.country}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap space-x-2 flex items-center">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.push(`/documents/edit/${doc._id}`)}
                                            className="border-blue-600 text-blue-600 hover:bg-blue-50"
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            disabled={deletingId === doc._id}
                                            onClick={() => deleteMutation.mutate(doc._id)}
                                            className="bg-red-600 hover:bg-red-700"
                                        >
                                            {deletingId === doc._id ? (
                                                <span className="flex items-center space-x-2">
                                                    <svg
                                                        className="w-4 h-4 animate-spin text-white"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                        ></circle>
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                                        ></path>
                                                    </svg>
                                                    <span>Deleting...</span>
                                                </span>
                                            ) : (
                                                "Delete"
                                            )}
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DocumentTable;
