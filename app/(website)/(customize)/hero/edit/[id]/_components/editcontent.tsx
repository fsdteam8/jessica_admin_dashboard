"use client";

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
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface EditcontentProps {
  id: string;
}

interface HeroContentData {
  text: string;
  country: string;
  image: string;
}

const fetchHeroContent = async ({
  id,
  token,
}: {
  id: string;
  token: string;
}): Promise<HeroContentData> => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/custom/hero/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data.data;
};

const Editcontent: React.FC<EditcontentProps> = ({ id }) => {
  const { data: session } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [text, setText] = useState("");
  const [country, setCountry] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [ispLoading, setIspLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>(
    "/placeholder.svg?height=128&width=128"
  );

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["herocontent", id],
    queryFn: () => {
      const token = session?.accessToken;
      if (!token) throw new Error("No access token available");
      return fetchHeroContent({ id, token });
    },
    enabled: !!session?.accessToken && !!id,
  });

  useEffect(() => {
    if (data) {
      setText(data.text);
      setCountry(data.country);
      setImagePreview(data.image || "/placeholder.svg?height=128&width=128");
    }
  }, [data]);

  useEffect(() => {
    if (!imageFile) return;
    const objectUrl = URL.createObjectURL(imageFile);
    setImagePreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIspLoading(true);
    const token = session?.accessToken;
    if (!token) return;

    const formData = new FormData();
    formData.append("text", text);
    formData.append("country", country);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/custom/hero/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Hero content updated successfully!");
      setText(res.data.data.text);
      setCountry(res.data.data.country);
      setImagePreview(res.data.data.image || "/placeholder.svg?height=128&width=128");
      setImageFile(null); // Reset image file after successful update
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update hero content. Please try again.");
    } finally {
      setIspLoading(false);
    }
  };

  if (isLoading) return <div className="text-center mt-10">Loading...</div>;
  if (isError) return <div className="text-center mt-10 text-red-500">Failed to load hero content.</div>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Edit Hero Content</CardTitle>
          <CardDescription>Update homepage text, country and image.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center">
              <div
                onClick={handleImageClick}
                className="w-32 h-32 rounded-full border-2 border-gray-300 dark:border-gray-600 cursor-pointer overflow-hidden shadow hover:opacity-80 transition-all"
              >
                <Image
                  src={imagePreview}
                  width={128}
                  height={128}
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
            <div className="space-y-2">
              <Label htmlFor="text">Text</Label>
              <Input
                id="text"
                placeholder="Enter Text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
              />
            </div>
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
            <Button type="submit" className="w-full">
            {ispLoading ? "Updating..." : "Update Hero Content"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-sm text-center text-gray-500 dark:text-gray-400">
          Click the image to change it.
        </CardFooter>
      </Card>
    </div>
  );
};

export default Editcontent;
