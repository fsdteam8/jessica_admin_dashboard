

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
        <Card>
            <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Hero List</h2>
                    <Button onClick={() => router.push("/hero/add")}>
                        <Plus className="w-4 h-4 mr-1" />
                        Add New
                    </Button>
                </div>

                {isLoading ? (
                    <p>Loading...</p>
                ) : isError ? (
                    <p>Failed to load data.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-100 text-left">
                                    <th className="p-3 text-sm font-medium">Image</th>
                                    <th className="p-3 text-sm font-medium">Text</th>
                                    <th className="p-3 text-sm font-medium">Country</th>
                                    <th className="p-3 text-sm font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.map((item) => (
                                    <tr key={item._id} className="border-b hover:bg-gray-50">
                                        <td className="p-3">
                                            <div className="w-20 h-20 relative">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="rounded-full object-cover"
                                                />
                                            </div>
                                        </td>
                                        <td className="p-3">{item.text}</td>
                                        <td className="p-3">{item.country}</td>
                                        <td className="p-3 flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => router.push(`/hero/edit/${item._id}`)}
                                                disabled={deletingId === item._id}
                                            >
                                                <Pencil className="w-4 h-4 mr-1" />
                                                Edit
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                disabled={deletingId === item._id}
                                                onClick={() => handleDelete(item._id)}
                                            >
                                                {deletingId === item._id ? (
                                                    <span className="flex items-center">
                                                        <svg className="w-4 h-4 mr-1 animate-spin" viewBox="0 0 24 24">
                                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                            <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                                                        </svg>
                                                        Deleting...
                                                    </span>
                                                ) : (
                                                    <>
                                                        <Trash className="w-4 h-4 mr-1" />
                                                        Delete
                                                    </>
                                                )}
                                            </Button>
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
