"use client";
import type React from "react";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

declare module "next-auth" {
  interface Session {
    accessToken: string;
  }
}

export default function EditPracticeAreaPage() {
  const router = useRouter();
  const { id } = useParams(); // Get practice area ID from URL
  const session = useSession();
  const TOKEN = session?.data?.accessToken;

  // Fetch practice area data
  const { data, isLoading, error } = useQuery({
    queryKey: ["practiceArea", id],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/practice-area/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch practice area");
      }
      return response.json();
    },
    enabled: !!id && !!TOKEN, // Only fetch if id and token are available
  });

  // Initialize form data with fetched data or default values
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    subPracticeAreas: [""], // Initialize with one empty subcategory
  });

  // Update form data when fetched data is available
  useEffect(() => {
    if (data?.data) {
      setFormData({
        name: data.data.name || "",
        description: data.data.description || "",
        subPracticeAreas: data.data.subPracticeAreas?.length
          ? data.data.subPracticeAreas
          : [""], // Ensure at least one empty subcategory
      });
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/practice-area/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update practice area");
      }

      return response.json();
    },
    onSuccess: (success) => {
      toast.success(success.message || "Practice area updated successfully");
      router.push("/practice-area");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubCategoryChange = (index: number, value: string) => {
    const updatedSubCategories = [...formData.subPracticeAreas];
    updatedSubCategories[index] = value;
    setFormData({ ...formData, subPracticeAreas: updatedSubCategories });
  };

  const addSubCategory = () => {
    setFormData({
      ...formData,
      subPracticeAreas: [...formData.subPracticeAreas, ""],
    });
  };

  const removeSubCategory = (index: number) => {
    if (formData.subPracticeAreas.length > 1) {
      const updatedSubCategories = formData.subPracticeAreas.filter(
        (_, i) => i !== index
      );
      setFormData({ ...formData, subPracticeAreas: updatedSubCategories });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Practice-area name is required");
      return;
    }

    // Filter out empty subcategories before submitting
    const filteredData = {
      ...formData,
      subPracticeAreas: formData.subPracticeAreas.filter(
        (sub) => sub.trim() !== ""
      ),
    };

    // Log form data
    console.log("Form Data Submitted:", filteredData);

    mutation.mutate(filteredData);
  };

  if (isLoading) {
    return <div className="p-6 bg-[#EDEEF1]">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-6 bg-[#EDEEF1]">
        <p className="text-red-500">Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#EDEEF1] p-6">
      <div className="flex-1 overflow-auto">
        <div>
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              Edit Practice-area
            </h1>
            <p className="text-gray-500">Dashboard &gt; Practice-area</p>
          </div>

          <div className="pt-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Practice-area Name</Label>
                <Input
                  id="name"
                  placeholder="Type category name here..."
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="mt-3 h-[50px] border border-[#707070]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label>Sub Categories</Label>
                  <Button
                    type="button"
                    onClick={addSubCategory}
                    variant="outline"
                    size="sm"
                    className="border border-[#707070]"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Sub Category
                  </Button>
                </div>

                <div className="space-y-3">
                  {formData.subPracticeAreas.map((subCategory, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        placeholder="Type sub category name here..."
                        value={subCategory}
                        onChange={(e) =>
                          handleSubCategoryChange(index, e.target.value)
                        }
                        className="h-[50px] border border-[#707070]"
                      />
                      {formData.subPracticeAreas.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeSubCategory(index)}
                          variant="outline"
                          size="sm"
                          className="px-2 border border-[#707070] text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Type category description here..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="mt-1 min-h-[120px] border border-[#707070]"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  className="bg-slate-600 hover:bg-slate-700"
                >
                  <span className="mr-2">
                    <Save />
                  </span>
                  {mutation.isPending ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}