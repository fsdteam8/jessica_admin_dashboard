// "use client";

// import React, { useState, useEffect } from "react";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import Image from "next/image";
// import axios from "axios";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";

// interface Props {
//     id: string;
// }

// const EditDocument = ({ id }: Props) => {
//     const [title, setTitle] = useState("");
//     const [description, setDescription] = useState("");
//     const [country, setCountry] = useState("");
//     const [email, setEmail] = useState("");
//     const [image, setImage] = useState<File | null>(null);
//     const [imagePreview, setImagePreview] = useState<string | null>(null);

//     const queryClient = useQueryClient();
//     const router = useRouter();
//     const { data: session } = useSession();
//     const token = session?.accessToken || "";

//     // Fetch single document
//     const { data: documentData, isLoading } = useQuery({
//         queryKey: ["single-document", id],
//         queryFn: async () => {
//             const res = await axios.get(
//                 `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/custom/legal-document/${id}`,
//                 {
//                     headers: { Authorization: `Bearer ${token}` },
//                 }
//             );
//             return res.data.data;
//         },
//         enabled: !!id && !!token,
//     });

//     // Populate form
//     useEffect(() => {
//         if (documentData) {
//             setTitle(documentData.title || "");
//             setDescription(documentData.description || "");
//             setCountry(documentData.country || "");
//             setEmail(documentData.email || "");
//             if (documentData.image) {
//                 setImagePreview(documentData.image);
//             }
//         }
//     }, [documentData]);

//     const mutation = useMutation({
//         mutationFn: async (formData: FormData) => {
//             const res = await axios.put(
//                 `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/custom/legal-document/${id}`,
//                 formData,
//                 {
//                     headers: {
//                         "Content-Type": "multipart/form-data",
//                         Authorization: `Bearer ${token}`,
//                     },
//                 }
//             );
//             return res.data;
//         },
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ["document"] });
//             alert("Document updated successfully!");
//             router.push("/admin/document");
//         },
//         onError: (err) => {
//             console.error("Update error:", err);
//             alert("Failed to update document.");
//         },
//     });

//     const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0] || null;
//         setImage(file);

//         if (file) {
//             const previewUrl = URL.createObjectURL(file);
//             setImagePreview(previewUrl);
//         }
//     };

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         const formData = new FormData();
//         formData.append("title", title);
//         formData.append("description", description);
//         formData.append("country", country);
//         formData.append("email", email);
//         if (image) {
//             formData.append("image", image);
//         }
//         mutation.mutate(formData);
//     };

//     if (isLoading) return <div>Loading...</div>;

//     return (
//         <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
//             <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl">
//                 <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
//                     Edit Document
//                 </h2>

//                 <form onSubmit={handleSubmit}>
//                     {/* Title */}
//                     <div className="mb-4">
//                         <label className="block text-gray-700 font-semibold mb-2">Title</label>
//                         <input
//                             type="text"
//                             value={title}
//                             onChange={(e) => setTitle(e.target.value)}
//                             placeholder="Enter title"
//                             className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             required
//                         />
//                     </div>

//                     {/* Description */}
//                     <div className="mb-4">
//                         <label className="block text-gray-700 font-semibold mb-2">Description</label>
//                         <textarea
//                             value={description}
//                             onChange={(e) => setDescription(e.target.value)}
//                             placeholder="Enter description"
//                             rows={5}
//                             className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             required
//                         />
//                     </div>

//                     {/* Country */}
//                     <div className="mb-4">
//                         <label className="block text-gray-700 font-semibold mb-2">Country</label>
//                         <input
//                             type="text"
//                             value={country}
//                             onChange={(e) => setCountry(e.target.value)}
//                             placeholder="Enter country"
//                             className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             required
//                         />
//                     </div>

//                     {/* Email */}
//                     <div className="mb-4">
//                         <label className="block text-gray-700 font-semibold mb-2">Email</label>
//                         <input
//                             type="email"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             placeholder="Enter email"
//                             className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             required
//                         />
//                     </div>

//                     {/* Image Upload */}
//                     <div className="mb-4">
//                         <label className="block text-gray-700 font-semibold mb-2">Image</label>
//                         <input
//                             type="file"
//                             accept="image/*"
//                             onChange={handleImageChange}
//                             className="w-full p-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#23547B] file:text-white hover:file:bg-blue-600"
//                         />
//                         {imagePreview && (
//                             <div className="mt-4 w-full h-52 relative">
//                                 <Image
//                                     src={imagePreview}
//                                     alt="Image Preview"
//                                     fill
//                                     unoptimized
//                                     className="object-cover rounded-lg shadow-md"
//                                 />
//                             </div>
//                         )}
//                     </div>

//                     {/* Submit */}
//                     <div className="mt-6">
//                         <button
//                             type="submit"
//                             disabled={mutation.isPending}
//                             className="w-full p-3 bg-[#23547B] text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
//                         >
//                             {mutation.isPending ? "Updating..." : "Update Document"}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default EditDocument;
"use client";

import React, { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Props {
    id: string;
}

const EditDocument = ({ id }: Props) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [country, setCountry] = useState("");
    const [email, setEmail] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const queryClient = useQueryClient();
    const router = useRouter();
    const { data: session } = useSession();
    const token = session?.accessToken || "";

    // Fetch single document
    const { data: documentData, isLoading } = useQuery({
        queryKey: ["single-document", id],
        queryFn: async () => {
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/custom/legal-document/${id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            return res.data.data;
        },
        enabled: !!id && !!token,
    });

    // Populate form
    useEffect(() => {
        if (documentData) {
            setTitle(documentData.title || "");
            setDescription(documentData.description || "");
            setCountry(documentData.country || "");
            setEmail(documentData.email || "");
            if (documentData.image) {
                setImagePreview(documentData.image);
            }
        }
    }, [documentData]);

    const mutation = useMutation({
        mutationFn: async (formData: FormData) => {
            const res = await axios.put(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/custom/legal-document/${id}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["document"] });
            toast.success("Document updated successfully!");
            router.push("/documents");
        },
        onError: (err) => {
            console.error("Update error:", err);
            toast.error("Failed to update document.");
        },
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setImage(file);

        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
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
                    Edit Document
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
                            required
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
                            required
                        />
                    </div>

                    {/* Country Dropdown */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">Country</label>
                        <select
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="" disabled>
                                Select country
                            </option>
                            <option value="usa">USA</option>
                            <option value="canada">Canada</option>
                        </select>
                    </div>

                    {/* Email */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter email"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Image Upload */}
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
                            {mutation.isPending ? "Updating..." : "Update Document"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditDocument;

