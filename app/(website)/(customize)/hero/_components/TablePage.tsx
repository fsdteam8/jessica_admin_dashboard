// "use client";

// import { useQuery } from "@tanstack/react-query";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import Image from "next/image";
// import { Pencil, Trash, Plus } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useSession } from "next-auth/react";
// import { useState } from "react";

// interface Hero {
//     _id: string;
//     image: string;
//     name: string;
//     country: string;
//     text: string;
// }

// export default function TablePage() {
//     const router = useRouter();
//     const { data: session } = useSession();
//     const [deletingId, setDeletingId] = useState<string | null>(null);

//     const fetchHeroes = async (): Promise<Hero[]> => {
//         const token = session?.accessToken;
//         if (!token) throw new Error("No auth token found");

//         const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/custom/hero`, {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//             cache: "no-store",
//         });

//         if (!res.ok) {
//             throw new Error("Failed to fetch heroes");
//         }

//         const result = await res.json();
//         return result.data;
//     };

//     const { data, isLoading, isError, refetch } = useQuery({
//         queryKey: ["heroes"],
//         queryFn: fetchHeroes,
//         enabled: !!session,
//     });

//     const handleDelete = async (id: string) => {
//         const token = session?.accessToken;
//         if (!token) return;

//         try {
//             setDeletingId(id);
//             const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/custom/hero/${id}`, {
//                 method: "DELETE",
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             });

//             if (!res.ok) throw new Error("Failed to delete");
//             await refetch();
//         } catch (error) {
//             console.error("Delete failed:", error);
//         } finally {
//             setDeletingId(null);
//         }
//     };

//     return (
//         <Card className="shadow-lg border-none rounded-xl">
//             <CardContent className="p-6">
//                 <div className="flex justify-between items-center mb-6">
//                     <h2 className="text-2xl font-semibold text-gray-800">Hero List</h2>
//                     <Button
//                         onClick={() => router.push("/hero/add")}
//                         className="bg-blue-600 hover:bg-blue-700 text-white transition-colors"
//                     >
//                         <Plus className="w-5 h-5 mr-2" />
//                         Add New Hero
//                     </Button>
//                 </div>

//                 {isLoading ? (
//                     <div className="flex justify-center items-center h-40">
//                         <p className="text-gray-500 text-lg">Loading...</p>
//                     </div>
//                 ) : isError ? (
//                     <div className="flex justify-center items-center h-40">
//                         <p className="text-red-500 text-lg">Failed to load data.</p>
//                     </div>
//                 ) : (
//                     <div className="overflow-x-auto rounded-lg border border-gray-200">
//                         <table className="w-full text-left">
//                             <thead className="bg-gray-50 text-gray-700">
//                                 <tr>
//                                     <th className="p-4 text-sm font-semibold">Image</th>
//                                     <th className="p-4 text-sm font-semibold">Text</th>
//                                     <th className="p-4 text-sm font-semibold">Country</th>
//                                     <th className="p-4 text-sm font-semibold">Actions</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {data && data?.map((item) => (
//                                     <tr key={item?._id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
//                                         <td className="p-4">
//                                             <div className="w-16 h-16 relative">
//                                                 <Image
//                                                     src={item?.image}
//                                                     alt={item?.name}
//                                                     fill
//                                                     className="rounded-full object-cover border border-gray-200"
//                                                 />
//                                             </div>
//                                         </td>
//                                         <td className="p-4 text-gray-700">{item?.text}</td>
//                                         <td className="p-4 text-gray-700">{item?.country}</td>
//                                         <td className="p-4  gap-3">
//                                             <div className="flex items-center space-x-2">
//                                                 <Button
//                                                     variant="outline"
//                                                     size="sm"
//                                                     onClick={() => router.push(`/hero/edit/${item._id}`)}
//                                                     disabled={deletingId === item._id}
//                                                     className="text-blue-600 border-blue-600 flex  hover:bg-blue-50"
//                                                 >
//                                                     <Pencil className="w-4 h-4 mr-2" />
//                                                     Edit
//                                                 </Button>
//                                                 <Button
//                                                     variant="destructive"
//                                                     size="sm"
//                                                     disabled={deletingId === item._id}
//                                                     onClick={() => handleDelete(item._id)}
//                                                     className="bg-red-600 hover:bg-red-700"
//                                                 >
//                                                     {deletingId === item._id ? (
//                                                         <span className="flex items-center">
//                                                             <svg className="w-4 h-4 mr-2 animate-spin" viewBox="0 0 24 24">
//                                                                 <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
//                                                                 <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
//                                                             </svg>
//                                                             Deleting...
//                                                         </span>
//                                                     ) : (
//                                                         <>
//                                                             <Trash className="w-4 h-4 mr-2" />
//                                                             Delete
//                                                         </>
//                                                     )}
//                                                 </Button>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 )}
//             </CardContent>
//         </Card>
//     );
// }

"use client";

import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Pencil, Trash, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";

interface Hero {
    _id: string;
    image: string;
    name: string;
    country: string;
    text: string;
}

export default function TablePage() {
    const router = useRouter();
    const { data: session } = useSession();
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchHeroes = async (): Promise<Hero[]> => {
        const token = session?.accessToken;
        if (!token) throw new Error("No auth token found");

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/custom/hero`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        });

        if (!res.ok) {
            throw new Error("Failed to fetch heroes");
        }

        const result = await res.json();
        // Ensure it's an array
        if (!Array.isArray(result.data)) {
            throw new Error("Invalid data format: data is not an array");
        }
 
        return result.data;
    };
    

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["heroes"],
        queryFn: fetchHeroes,
        enabled: !!session,
    });
    const handleDelete = async (id: string) => {
        const token = session?.accessToken;
        if (!token) return;

        try {
            setDeletingId(id);
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/custom/hero/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error("Failed to delete");
            await refetch();
        } catch (error) {
            console.error("Delete failed:", error);
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <Card className="shadow-lg border-none rounded-xl">
            <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">Hero List</h2>
                    <Button
                        onClick={() => router.push("/hero/add")}
                        className="bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Add New Hero
                    </Button>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                        <p className="text-gray-500 text-lg">Loading...</p>
                    </div>
                ) : isError ? (
                    <div className="flex justify-center items-center h-40">
                        <p className="text-red-500 text-lg">Failed to load data.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-700">
                                <tr>
                                    <th className="p-4 text-sm font-semibold">Image</th>
                                    <th className="p-4 text-sm font-semibold">Text</th>
                                    <th className="p-4 text-sm font-semibold">Country</th>
                                    <th className="p-4 text-sm font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(data) && data.map((item) => (
                                    <tr key={item._id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            <div className="w-16 h-16 relative">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="rounded-full object-cover border border-gray-200"
                                                />
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-700">{item.text}</td>
                                        <td className="p-4 text-gray-700">{item.country}</td>
                                        <td className="p-4 gap-3">
                                            <div className="flex items-center space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => router.push(`/hero/edit/${item._id}`)}
                                                    disabled={deletingId === item._id}
                                                    className="text-blue-600 border-blue-600 flex hover:bg-blue-50"
                                                >
                                                    <Pencil className="w-4 h-4 mr-2" />
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    disabled={deletingId === item._id}
                                                    onClick={() => handleDelete(item._id)}
                                                    className="bg-red-600 hover:bg-red-700"
                                                >
                                                    {deletingId === item._id ? (
                                                        <span className="flex items-center">
                                                            <svg className="w-4 h-4 mr-2 animate-spin" viewBox="0 0 24 24">
                                                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                                <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                                                            </svg>
                                                            Deleting...
                                                        </span>
                                                    ) : (
                                                        <>
                                                            <Trash className="w-4 h-4 mr-2" />
                                                            Delete
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
