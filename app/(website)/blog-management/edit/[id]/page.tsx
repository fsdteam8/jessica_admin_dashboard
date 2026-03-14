"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import dynamic from "next/dynamic"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { PageHeader } from "@/components/page-header"
import { Breadcrumb } from "@/components/breadcrumb"
import { useSession } from "next-auth/react"

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false })
import "react-quill/dist/quill.snow.css"

interface Blog {
  _id: string
  title: string
  description: string
  thumbnail: string | null
  createdAt: string
  updatedAt: string
}

interface BlogResponse {
  status: boolean
  message: string
  data: Blog
}

export default function EditBlogPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data: session, status } = useSession()
  const TOKEN = session?.accessToken
  const blogId = Array.isArray(params?.id) ? params.id[0] : params?.id

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  })

  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [existingThumbnail, setExistingThumbnail] = useState<string | null>(null)

  // Fetch existing blog
  const {
    data: blogData,
    isLoading: isFetchingBlog,
    error: fetchError,
  } = useQuery({
    queryKey: ["blog", blogId],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/blog/${blogId}`, {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      })
      if (!res.ok) {
        throw new Error("Failed to fetch blog")
      }
      return res.json() as Promise<BlogResponse>
    },
    enabled: !!blogId && !!TOKEN,
  })

  useEffect(() => {
    if (blogData?.data) {
      setFormData({
        title: blogData.data.title || "",
        description: blogData.data.description || "",
      })
      setExistingThumbnail(blogData.data.thumbnail)
      setThumbnailPreview(blogData.data.thumbnail)
    }
  }, [blogData])

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["link", "image"],
      ["clean"],
    ],
  }

  const formats = [
    "header", "bold", "italic", "underline", "strike",
    "list", "bullet", "align", "link", "image"
  ]

  const updateBlogMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/blog/${blogId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
        body: data,
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to update blog")
      }

      return res.json() as Promise<BlogResponse>
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: data.message || "Blog updated successfully",
      })
      queryClient.invalidateQueries({ queryKey: ["blogs"] })
      queryClient.invalidateQueries({ queryKey: ["blog", blogId] })
      router.push("/blog-management")
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update blog",
        variant: "destructive",
      })
    },
  })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setThumbnail(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeThumbnail = () => {
    setThumbnail(null)
    setThumbnailPreview(existingThumbnail)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Blog title is required",
        variant: "destructive",
      })
      return
    }

    const blogFormData = new FormData()
    blogFormData.append("title", formData.title)
    blogFormData.append("description", formData.description)
    if (thumbnail) blogFormData.append("thumbnail", thumbnail)

    updateBlogMutation.mutate(blogFormData)
  }

  if (status === "loading" || isFetchingBlog) {
    return <div className="p-6">Loading...</div>
  }

  if (fetchError) {
    return <div className="p-6 text-red-500">Error: {fetchError.message}</div>
  }

  return (
    <div className="flex h-screen bg-[#EDEEF1]">
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <PageHeader title="Blog management" buttonText="Update" onButtonClick={handleSubmit} />
          <Breadcrumb
            items={[
              { label: "Dashboard", href: "/" },
              { label: "Blog management", href: "/blog-management" },
              { label: "Edit Blog" },
            ]}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="p-6">
                <form id="blog-form" onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="title">Blog Title</Label>
                    <Input
                      id="title"
                      placeholder="Add your title..."
                      value={formData.title}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, title: e.target.value }))
                      }
                      className="mt-3 border border-[#707070] h-[50px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <div className="mt-3">
                      <div className="border border-[#707070] rounded-md overflow-hidden">
                        <ReactQuill
                          theme="snow"
                          value={formData.description}
                          onChange={(content) =>
                            setFormData((prev) => ({ ...prev, description: content }))
                          }
                          modules={modules}
                          formats={formats}
                          placeholder="Write your blog content here..."
                          style={{ height: "300px" }}
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-6">
                <Label>Thumbnail</Label>
                <Card className="mt-3 shadow-none h-[410px] border border-[#707070]">
                  <CardContent className="p-6 h-full">
                    {thumbnailPreview ? (
                      <div className="relative h-full">
                        <Image
                          src={thumbnailPreview}
                          alt="Thumbnail preview"
                          fill
                          className="object-cover rounded-lg"
                        />
                        {thumbnail && (
                          <button
                            type="button"
                            onClick={removeThumbnail}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                        {!thumbnail && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="bg-white text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100"
                            >
                              Change Image
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center h-full flex flex-col justify-center cursor-pointer hover:border-gray-400 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Upload thumbnail</p>
                        <p className="text-sm text-gray-400 mt-2">Click to browse files</p>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .ql-editor {
          min-height: 300px !important;
          font-family: inherit;
        }
        .ql-toolbar {
          border: none !important;
          border-bottom: 1px solid #707070 !important;
        }
        .ql-container {
          border: none !important;
        }
        .ql-snow .ql-tooltip {
          z-index: 1000;
        }
      `}</style>
    </div>
  )
}
