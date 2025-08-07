// // "use client";

// // import React, { useState, useEffect } from "react";
// // import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// // import Image from "next/image";
// // import axios from "axios";
// // import { useSession } from "next-auth/react";

// // const Document = () => {
// //     const [title, setTitle] = useState("");
// //     const [description, setDescription] = useState("");
// //     const [country, setCountry] = useState("");
// //     const [email, setEmail] = useState("");
// //     const [image, setImage] = useState<File | null>(null);
// //     const [imagePreview, setImagePreview] = useState<string | null>(null);

// //     const queryClient = useQueryClient();
// //     const { data: session } = useSession();
// //     const token = session?.accessToken || "";

// //     // Fetch existing data
// //     const { data: response, isLoading } = useQuery({
// //         queryKey: ["document"],
// //         queryFn: async () => {
// //             const res = await axios.get(
// //                 `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/custom/legal-document`,
// //                 {
// //                     headers: { Authorization: `Bearer ${token}` },
// //                 }
// //             );
// //             return res.data;
// //         },
// //         retry: false,
// //     });

// //     const existingData = response?.data;
// //     console.log(existingData);
// //     useEffect(() => {
// //         if (existingData) {
// //             setTitle(existingData.title || "");
// //             setDescription(existingData.description || "");
// //             setCountry(existingData.country || "");
// //             setEmail(existingData?.email || "");
// //             if (existingData.image) {
// //                 setImagePreview(existingData.image);
// //             }
// //         }
// //     }, [existingData]);

// //     const mutation = useMutation({
// //         mutationFn: async (formData: FormData) => {
// //             const isUpdate = !!existingData;
// //             const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/custom/legal-document/${isUpdate ? existingData._id : ""}`;
// //             const method = isUpdate ? "PUT" : "POST";

// //             const res = await axios({
// //                 method,
// //                 url,
// //                 data: formData,
// //                 headers: {
// //                     "Content-Type": "multipart/form-data",
// //                     Authorization: `Bearer ${token}`,
// //                 },
// //             });
// //             return res.data;
// //         },
// //         onSuccess: () => {
// //             queryClient.invalidateQueries({ queryKey: ["document"] });
// //             alert("Data saved successfully!");
// //         },
// //         onError: (err) => {
// //             console.error("Error saving data:", err);
// //             alert("Failed to save data. Please try again.");
// //         },
// //     });

// //     const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //         const file = e.target.files?.[0] || null;
// //         setImage(file);

// //         if (file) {
// //             const previewUrl = URL.createObjectURL(file);
// //             setImagePreview(previewUrl);
// //         } else {
// //             setImagePreview(null);
// //         }
// //     };

// //     const handleSubmit = (e: React.FormEvent) => {
// //         e.preventDefault();
// //         const formData = new FormData();
// //         formData.append("title", title);
// //         formData.append("description", description);
// //         formData.append("country", country);
// //         formData.append("email", email);
// //         if (image) {
// //             formData.append("image", image);
// //         }
// //         mutation.mutate(formData);
// //     };

// //     if (isLoading) return <div>Loading...</div>;

// //     return (
// //         <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
// //             <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl">
// //                 <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
// //                     Document Section
// //                 </h2>

// //                 <form onSubmit={handleSubmit}>
// //                     {/* Title */}
// //                     <div className="mb-4">
// //                         <label className="block text-gray-700 font-semibold mb-2">Title</label>
// //                         <input
// //                             type="text"
// //                             value={title}
// //                             onChange={(e) => setTitle(e.target.value)}
// //                             placeholder="Enter title"
// //                             className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                         />
// //                     </div>

// //                     {/* Description */}
// //                     <div className="mb-4">
// //                         <label className="block text-gray-700 font-semibold mb-2">Description</label>
// //                         <textarea
// //                             value={description}
// //                             onChange={(e) => setDescription(e.target.value)}
// //                             placeholder="Enter description"
// //                             rows={5}
// //                             className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                         />
// //                     </div>

// //                     {/* Country */}
// //                     <div className="mb-4">
// //                         <label className="block text-gray-700 font-semibold mb-2">Country</label>
// //                         <input
// //                             type="text"
// //                             value={country}
// //                             onChange={(e) => setCountry(e.target.value)}
// //                             placeholder="Enter country"
// //                             className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                         />
// //                     </div>
// //                     <div className="mb-4">
// //                         <label className="block text-gray-700 font-semibold mb-2">Email</label>
// //                         <input
// //                             type="text"
// //                             value={email}
// //                             onChange={(e) => setEmail(e.target.value)}
// //                             placeholder="Enter Email"
// //                             className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                         />
// //                     </div>

// //                     {/* Single Image Upload */}
// //                     <div className="mb-4">
// //                         <label className="block text-gray-700 font-semibold mb-2">Image</label>
// //                         <input
// //                             type="file"
// //                             accept="image/*"
// //                             onChange={handleImageChange}
// //                             className="w-full p-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#23547B] file:text-white hover:file:bg-blue-600"
// //                         />
// //                         {imagePreview && (
// //                             <div className="mt-4 w-full h-52 relative">
// //                                 <Image
// //                                     src={imagePreview}
// //                                     alt="Image Preview"
// //                                     fill
// //                                     unoptimized
// //                                     className="object-cover rounded-lg shadow-md"
// //                                 />
// //                             </div>
// //                         )}
// //                     </div>

// //                     {/* Submit */}
// //                     <div className="mt-6">
// //                         <button
// //                             type="submit"
// //                             disabled={mutation.isPending}
// //                             className="w-full p-3 bg-[#23547B] text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
// //                         >
// //                             {mutation.isPending ? "Saving..." : existingData ? "Update" : "Create"}
// //                         </button>
// //                     </div>
// //                 </form>
// //             </div>
// //         </div>
// //     );
// // };

// // export default Document;

// "use client";

// import React, { useState } from "react";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import axios from "axios";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button"; // adjust if you have this component
// import Image from "next/image";

// const AddDocument = () => {
//     const { data: session } = useSession();
//     const token = session?.accessToken || "";
//     const queryClient = useQueryClient();
//     const router = useRouter();

//     const [title, setTitle] = useState("");
//     const [description, setDescription] = useState("");
//     const [country, setCountry] = useState("");
//     const [email, setEmail] = useState("");
//     const [image, setImage] = useState<File | null>(null);
//     const [imagePreview, setImagePreview] = useState<string | null>(null);

//     const mutation = useMutation({
//         mutationFn: async (formData: FormData) => {
//             const res = await axios.post(
//                 `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/custom/legal-document`,
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
//             alert("Document added successfully!");
//             router.push("/document"); // Redirect back to document list
//         },
//         onError: (error) => {
//             console.error("Error adding document:", error);
//             alert("Failed to add document. Please try again.");
//         },
//     });

//     const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0] || null;
//         setImage(file);

//         if (file) {
//             const url = URL.createObjectURL(file);
//             setImagePreview(url);
//         } else {
//             setImagePreview(null);
//         }
//     };

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();

//         if (!title.trim() || !description.trim() || !country.trim()) {
//             alert("Please fill in all fields.");
//             return;
//         }

//         if (!image) {
//             alert("Please select an image.");
//             return;
//         }

//         const formData = new FormData();
//         formData.append("title", title);
//         formData.append("description", description);
//         formData.append("country", country);
//         formData.append("image", image);
//         formData.append("email", email);

//         mutation.mutate(formData);
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
//             <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-8">
//                 <h2 className="text-3xl font-semibold mb-6 text-gray-800 text-center">
//                     Add New Document
//                 </h2>
//                 <form onSubmit={handleSubmit} className="space-y-6">
//                     {/* Title */}
//                     <div>
//                         <label className="block mb-2 font-semibold text-gray-700">Title</label>
//                         <input
//                             type="text"
//                             value={title}
//                             onChange={(e) => setTitle(e.target.value)}
//                             placeholder="Enter title"
//                             className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                             required
//                         />
//                     </div>

//                     {/* Description */}
//                     <div>
//                         <label className="block mb-2 font-semibold text-gray-700">Description</label>
//                         <textarea
//                             value={description}
//                             onChange={(e) => setDescription(e.target.value)}
//                             placeholder="Enter description"
//                             rows={5}
//                             className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                             required
//                         />
//                     </div>

//                     {/* Country */}
//                     <div>
//                         <label className="block mb-2 font-semibold text-gray-700">Country</label>
//                         <input
//                             type="text"
//                             value={country}
//                             onChange={(e) => setCountry(e.target.value)}
//                             placeholder="Enter country"
//                             className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                             required
//                         />
//                     </div>
//                     <div className="mb-4">
//                         <label className="block text-gray-700 font-semibold mb-2">Email</label>
//                         <input
//                             type="text"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             placeholder="Enter Email"
//                             className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                     </div>

//                     {/* Image Upload */}
//                     <div>
//                         <label className="block mb-2 font-semibold text-gray-700">Image</label>
//                         <input
//                             type="file"
//                             accept="image/*"
//                             onChange={handleImageChange}
//                             className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#23547B] file:text-white hover:file:bg-blue-600"
//                             required
//                         />
//                         {imagePreview && (
//                             <div className="mt-4 w-full h-56 relative rounded-lg overflow-hidden shadow-md">
//                                 <Image
//                                     src={imagePreview}
//                                     alt="Image Preview"
//                                     fill
//                                     className="object-cover"
//                                     unoptimized
//                                 />
//                             </div>
//                         )}
//                     </div>

//                     {/* Submit Button */}
//                     <Button
//                         type="submit"
//                         className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition"
//                         disabled={mutation.isPending}
//                     >
//                         {mutation.isPending ? "Saving..." : "Add Document"}
//                     </Button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default AddDocument;
"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"; // adjust if needed
import Image from "next/image";
import { toast } from "sonner";

const AddDocument = () => {
    const { data: session } = useSession();
    const token = session?.accessToken || "";
    const queryClient = useQueryClient();
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [country, setCountry] = useState(""); // will be "usa" or "canada"
    const [email, setEmail] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const mutation = useMutation({
        mutationFn: async (formData: FormData) => {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/custom/legal-document`,
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
            toast.success("Document added successfully!");
            router.push("/documents");
        },
        onError: (error) => {
            console.error("Error adding document:", error);
            toast.error("Failed to add document. Please try again.");
        },
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setImage(file);

        if (file) {
            const url = URL.createObjectURL(file);
            setImagePreview(url);
        } else {
            setImagePreview(null);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !description.trim() || !country.trim()) {
            alert("Please fill in all fields.");
            return;
        }

        if (!image) {
            alert("Please select an image.");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("country", country);
        formData.append("image", image);
        formData.append("email", email);

        mutation.mutate(formData);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-8">
                <h2 className="text-3xl font-semibold mb-6 text-gray-800 text-center">
                    Add New Document
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block mb-2 font-semibold text-gray-700">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter title"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block mb-2 font-semibold text-gray-700">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter description"
                            rows={5}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            required
                        />
                    </div>

                    {/* Country Dropdown */}
                    <div>
                        <label className="block mb-2 font-semibold text-gray-700">Country</label>
                        <select
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                    <div>
                        <label className="block mb-2 font-semibold text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter Email"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block mb-2 font-semibold text-gray-700">Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#23547B] file:text-white hover:file:bg-[#23547B]"
                            required
                        />
                        {imagePreview && (
                            <div className="mt-4 w-full h-56 relative rounded-lg overflow-hidden shadow-md">
                                <Image
                                    src={imagePreview}
                                    alt="Image Preview"
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full bg-[#23547B] hover:bg-[#2f74ad] text-white font-semibold py-3 rounded-lg shadow-md transition"
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? "Saving..." : "Add Document"}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default AddDocument;
