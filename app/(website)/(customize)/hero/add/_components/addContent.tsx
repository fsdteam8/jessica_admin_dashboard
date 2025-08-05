// "use client";

// import { useState, useEffect, useRef } from "react";
// import { useRouter } from "next/navigation";
// import { useMutation } from "@tanstack/react-query";
// import Image from "next/image";
// import {
//     Card,
//     CardHeader,
//     CardTitle,
//     CardDescription,
//     CardContent,
//     CardFooter,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner"; // Optional: If using toast notifications
// import { useSession } from "next-auth/react";

// export default function AddPage() {
//     const [name, setName] = useState("");
//     const [country, setCountry] = useState("");
//     const [imageFile, setImageFile] = useState<File | null>(null);
//     const [imagePreview, setImagePreview] = useState<string>("/placeholder.svg?height=128&width=128");
//     const fileInputRef = useRef<HTMLInputElement>(null);
//     const router = useRouter();
//     const token = useSession()?.data?.accessToken

//     useEffect(() => {
//         if (!imageFile) {
//             setImagePreview("/placeholder.svg?height=128&width=128");
//             return;
//         }
//         const objectUrl = URL.createObjectURL(imageFile);
//         setImagePreview(objectUrl);
//         return () => URL.revokeObjectURL(objectUrl);
//     }, [imageFile]);


//     const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (e.target.files && e.target.files.length > 0) {
//             setImageFile(e.target.files[0]);
//         }
//     };

//     const handleImageClick = () => {
//         fileInputRef.current?.click();
//     };

//     const { mutate, isPending } = useMutation({
//         mutationFn: async (data: { name: string; country: string; image: File }) => {
//             const formData = new FormData();
//             formData.append("text", data.name);
//             formData.append("country", data.country);
//             formData.append("image", data.image);

//             const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/custom/hero`, {
//                 method: "POST",
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//                 body: formData,
//             });

//             if (!res.ok) {
//                 const error = await res.json();
//                 throw new Error(error?.message || "Failed to add hero");
//             }

//             return res.json();
//         },
//         onSuccess: () => {
//             toast.success("Hero added successfully!");
//             router.push("/hero");
//         },
//         onError: (error) => {
//             toast.error(error.message || "Something went wrong!");
//         },
//     });

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!imageFile) {
//             toast.error("Please select an image");
//             return;
//         }

//         mutate({ name, country, image: imageFile });
//     };

//     return (
//         <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
//             <Card className="w-full max-w-md">
//                 <CardHeader className="text-center">
//                     <CardTitle className="text-2xl font-bold">Add New Hero</CardTitle>
//                     <CardDescription>
//                         Enter the user&apos;s details and upload an image.
//                     </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                     <form onSubmit={handleSubmit} className="space-y-6">
//                         {/* Image Upload */}
//                         <div className="flex justify-center">
//                             <div
//                                 onClick={handleImageClick}
//                                 className="w-32 h-32 rounded-full border-2 border-gray-300 dark:border-gray-600 cursor-pointer overflow-hidden shadow hover:opacity-80 transition-all"
//                             >
//                                 <Image
//                                     src={imagePreview}
//                                     width={128}
//                                     height={128}
//                                     alt="User Image"
//                                     className="object-cover w-full h-full"
//                                 />
//                             </div>
//                             <input
//                                 ref={fileInputRef}
//                                 type="file"
//                                 accept="image/*"
//                                 onChange={handleImageChange}
//                                 className="hidden"
//                             />
//                         </div>

//                         {/* Name Input */}
//                         <div className="space-y-2">
//                             <Label htmlFor="name">Text</Label>
//                             <Input
//                                 id="name"
//                                 placeholder="Enter Text"
//                                 value={name}
//                                 onChange={(e) => setName(e.target.value)}
//                                 required
//                             />
//                         </div>

//                         {/* Country Input */}
//                         <div className="space-y-2">
//                             <Label htmlFor="country">Country</Label>
//                             <Input
//                                 id="country"
//                                 placeholder="Enter Country"
//                                 value={country}
//                                 onChange={(e) => setCountry(e.target.value)}
//                                 required
//                             />
//                         </div>

//                         {/* Submit Button */}
//                         <Button type="submit" className="w-full" disabled={isPending}>
//                             {isPending ? "Submitting..." : "Add Hero"}
//                         </Button>
//                     </form>
//                 </CardContent>
//                 <CardFooter className="text-sm text-center text-gray-500 dark:text-gray-400">
//                     Please ensure all fields are filled correctly.
//                 </CardFooter>
//             </Card>
//         </div>
//     );
// }
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"; // Optional: If using toast notifications
import { useSession } from "next-auth/react";

export default function AddPage() {
    const [name, setName] = useState("");
    const [country, setCountry] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("/placeholder.svg?height=128&width=128");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const token = useSession()?.data?.accessToken;

    useEffect(() => {
        if (!imageFile) {
            setImagePreview("/placeholder.svg?height=128&width=128");
            return;
        }
        const objectUrl = URL.createObjectURL(imageFile);
        setImagePreview(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [imageFile]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const { mutate, isPending } = useMutation({
        mutationFn: async (data: { name: string; country: string; image: File }) => {
            const formData = new FormData();
            formData.append("text", data.name);
            formData.append("country", data.country);
            formData.append("image", data.image);

            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/custom/hero`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error?.message || "Failed to add hero");
            }

            return res.json();
        },
        onSuccess: () => {
            toast.success("Hero added successfully!");
            router.push("/hero");
        },
        onError: (error) => {
            toast.error(error.message || "Something went wrong!");
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!imageFile) {
            toast.error("Please select an image");
            return;
        }

        mutate({ name, country, image: imageFile });
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">Add New Hero</CardTitle>
                    <CardDescription>
                        Enter the hero&apos;s details and upload an image.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Image Upload */}
                        <div className="flex justify-center">
                            <div
                                onClick={handleImageClick}
                                className="w-full h-40 rounded-lg border-2 border-gray-300 dark:border-gray-600 cursor-pointer overflow-hidden shadow hover:opacity-80 transition-all"
                            >
                                <Image
                                    src={imagePreview}
                                    width={160}   // 40 x 4 = 160px
                                    height={80}   // 20 x 4 = 80px
                                    alt="Hero Image"
                                    className="object-cover w-full h-full"
                                />
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </div>

                        {/* Name Input */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Text</Label>
                            <Input
                                id="name"
                                placeholder="Enter Text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        {/* Country Dropdown */}
                        <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <select
                                id="country"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                required
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="" disabled>
                                    Select Country
                                </option>
                                <option value="usa">USA</option>
                                <option value="canada">Canada</option>
                            </select>
                        </div>

                        {/* Submit Button */}
                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? "Submitting..." : "Add Hero"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="text-sm text-center text-gray-500 dark:text-gray-400">
                    Please ensure all fields are filled correctly.
                </CardFooter>
            </Card>
        </div>
    );
}
