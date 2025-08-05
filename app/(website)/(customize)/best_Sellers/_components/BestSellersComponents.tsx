// "use client";

// import React, { useState, useEffect } from "react";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import Image from "next/image";
// import axios from "axios";
// import { useSession } from "next-auth/react";

// const BestSellers = () => {
//     const [title, setTitle] = useState("");
//     const [description, setDescription] = useState("");
//     const [images, setImages] = useState<File[]>([]);
//     const [imagePreviews, setImagePreviews] = useState<string[]>([]);

//     const queryClient = useQueryClient();
//     const { data: session } = useSession();
//     const token = session?.accessToken || "";

//     // Fetch existing About data
//     const { data: aboutResponse, isLoading } = useQuery({
//         queryKey: ["about"],
//         queryFn: async () => {
//             const response = await axios.get(
//                 `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/custom/bestseller`,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 }
//             );
//             return response.data;
//         },
//         retry: false,
//     });

//     const existingData = aboutResponse?.data;

//     // Populate state with fetched data
//     useEffect(() => {
//         if (existingData) {
//             setTitle(existingData.title || "");
//             setDescription(existingData.description || "");
//             if (existingData.image) {
//                 // Support both single and multiple image previews from existingData.image
//                 const imageArray = Array.isArray(existingData.image)
//                     ? existingData.image
//                     : [existingData.image];
//                 setImagePreviews(imageArray);
//             }
//         }
//     }, [existingData]);

//     // Mutation for create/update
//     const mutation = useMutation({
//         mutationFn: async (formData: FormData) => {
//             const isUpdate = !!existingData;
//             const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/custom/bestseller/${isUpdate ? existingData._id : ""}`;
//             const method = isUpdate ? "PUT" : "POST";

//             const response = await axios({
//                 method,
//                 url,
//                 data: formData,
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                     Authorization: `Bearer ${token}`,
//                 },
//             });

//             return response.data;
//         },
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ["about"] });
//             alert("Data saved successfully!");
//         },
//         onError: (error) => {
//             console.error("Error saving data:", error);
//             alert("Failed to save data. Please try again.");
//         },
//     });

//     const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const files = e.target.files;
//         if (files && files.length > 0) {
//             const fileArray = Array.from(files);
//             setImages(fileArray);

//             const previews = fileArray.map((file) => URL.createObjectURL(file));
//             setImagePreviews(previews);
//         }
//     };

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         const formData = new FormData();
//         formData.append("title", title);
//         formData.append("description", description);

//         images.forEach((file) => {
//             formData.append("image", file);
//         });

//         mutation.mutate(formData);
//     };

//     if (isLoading) {
//         return <div>Loading...</div>;
//     }

//     return (
//         <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
//             <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl">
//                 <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
//                     Best Sellers Section
//                 </h2>

//                 <form onSubmit={handleSubmit}>
//                     {/* Title Input */}
//                     <div className="mb-4">
//                         <label className="block text-gray-700 font-semibold mb-2">
//                             Title
//                         </label>
//                         <input
//                             type="text"
//                             value={title}
//                             onChange={(e) => setTitle(e.target.value)}
//                             placeholder="Enter title"
//                             className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                     </div>

//                     {/* Description Textarea */}
//                     <div className="mb-4">
//                         <label className="block text-gray-700 font-semibold mb-2">
//                             Description
//                         </label>
//                         <textarea
//                             value={description}
//                             onChange={(e) => setDescription(e.target.value)}
//                             placeholder="Enter description"
//                             rows={5}
//                             className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                     </div>

//                     {/* Multiple Image Upload */}
//                     <div className="mb-4">
//                         <label className="block text-gray-700 font-semibold mb-2">
//                             Images
//                         </label>
//                         <input
//                             type="file"
//                             accept="image/*"
//                             onChange={handleImageChange}
//                             multiple
//                             className="w-full p-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#23547B] file:text-white hover:file:bg-blue-600"
//                         />
//                         {imagePreviews.length > 0 && (
//                             <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
//                                 {imagePreviews.map((preview, index) => (
//                                     <div key={index} className="w-full h-52 relative">
//                                         <Image
//                                             src={preview}
//                                             alt={`Image Preview ${index + 1}`}
//                                             fill
//                                             unoptimized
//                                             className="object-cover rounded-lg shadow-md"
//                                         />
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </div>

//                     {/* Submit Button */}
//                     <div className="mt-6">
//                         <button
//                             type="submit"
//                             disabled={mutation.isPending}
//                             className="w-full p-3 bg-[#23547B] text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
//                         >
//                             {mutation.isPending
//                                 ? "Saving..."
//                                 : existingData
//                                     ? "Update"
//                                     : "Create"}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default BestSellers;
"use client";

import React, { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import axios from "axios";
import { useSession } from "next-auth/react";

const BestSellers = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingId, setExistingId] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const token = session?.accessToken || "";

  // Fetch BestSeller Data
  const { data: aboutResponse, isLoading } = useQuery({
    queryKey: ["about"],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/custom/bestseller`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    },
    retry: false,
  });

  const existingData = aboutResponse?.data?.[0] || null;

  useEffect(() => {
    if (existingData) {
      setTitle(existingData.title || "");
      setDescription(existingData.description || "");
      setImagePreviews(existingData.image || []);
      setExistingId(existingData._id);
    }
  }, [existingData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      setImages(fileArray);

      const previews = fileArray.map((file) => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const isUpdate = !!existingId;
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/custom/bestseller/${isUpdate ? existingId : ""}`;
      const method = isUpdate ? "PUT" : "POST";

      const response = await axios({
        method,
        url,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["about"] });
      alert("Data saved successfully!");
      setImages([]);
    },
    onError: (error) => {
      console.error("Error saving data:", error);
      alert("Failed to save data. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);

    images.forEach((file) => {
      formData.append("image", file); // match backend key
    });

    mutation.mutate(formData);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Best Sellers Section
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

          {/* Images */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Images</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              multiple
              className="w-full p-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#23547B] file:text-white hover:file:bg-blue-600"
            />

            {imagePreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="w-full h-52 relative">
                    <Image
                      src={preview}
                      alt={`Image Preview ${index + 1}`}
                      fill
                      unoptimized
                      className="object-cover rounded-lg shadow-md"
                    />
                  </div>
                ))}
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
              {mutation.isPending
                ? "Saving..."
                : existingId
                ? "Update"
                : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BestSellers;
