// "use client";

// import type React from "react";
// import { useParams } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
// } from "@/components/ui/command";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useToast } from "@/hooks/use-toast";
// import { cn } from "@/lib/utils";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import {
//   Check,
//   ChevronDown,
//   FileText,
//   ImageIcon,
//   X,
//   Loader2,
// } from "lucide-react";
// import dynamic from "next/dynamic";
// import { useState, useEffect, useRef, useCallback, useMemo } from "react";
// import "react-quill/dist/quill.snow.css";
// import Image from "next/image";
// import { useSession } from "next-auth/react";
// import { PageHeader } from "@/components/page-header";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// // Import React Quill dynamically to avoid SSR issues
// const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

// interface Country {
//   _id: string;
//   countryName: string;
//   states: string[];
// }

// interface PracticeArea {
//   _id: string;
//   name: string;
//   description: string;
//   subPracticeAreas?: { _id: string; name: string }[]; // Add this property
// }

// interface ResourceType {
//   _id: string;
//   resourceTypeName: string;
//   description: string;
// }

// interface ResourceData {
//   _id: string;
//   title: string;
//   country: string;
//   states: string[];
//   resourceType: string[];
//   description: string;
//   price: number;
//   discountPrice: number;
//   quantity: number;
//   format: string;
//   thumbnail: string;
//   images: string[];
//   productStatus: string;
//   practiceAreas: string[];
//   file: {
//     url: string;
//     type: string;
//   };
// }

// interface FormDataState {
//   title: string;
//   price: string;
//   discountPrice: string;
//   quantity: string;
//   format: string;
//   country: string;
//   states: string[];
//   description: string;
//   practiceArea: string;
//   productStatus: string
//   resourceType: string;
//   thumbnail: File | null;
//   file: File | null;
//   images: File[];
// }

// export default function EditPage() {
//   const params = useParams();
//   // const router = useRouter()
//   const slug = params.id as string;
//   const { toast } = useToast();
//   const queryClient = useQueryClient();
//   const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
//   const [selectedStates, setSelectedStates] = useState<string[]>([]);
//   const [countryOpen, setCountryOpen] = useState(false);
//   const [stateOpen, setStateOpen] = useState(false);
//   const [stateSearch, setStateSearch] = useState("");
//   const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
//   const [imagePreviews, setImagePreviews] = useState<string[]>([]);
//   const [existingImages, setExistingImages] = useState<string[]>([]);
//   const [selectedSubAreas, setSelectedSubAreas] = useState<string[]>([]);
//   const [practiceArea, setPracticeArea] = useState("");
//   const [previewOpen, setPreviewOpen] = useState(false)
//   const [existingThumbnail, setExistingThumbnail] = useState<string | null>(
//     null
//   );
//   const [existingFile, setExistingFile] = useState<{
//     url: string;
//     type: string;
//   } | null>(null);
//   const [isFormInitialized, setIsFormInitialized] = useState(false);
//   const thumbnailInputRef = useRef<HTMLInputElement>(null);

//   const [formData, setFormData] = useState<FormDataState>({
//     title: "",
//     price: "",
//     discountPrice: "",
//     quantity: "",
//     format: "",
//     productStatus: "",
//     country: "",
//     states: [],
//     description: "",
//     practiceArea: "",
//     resourceType: "",
//     thumbnail: null,
//     file: null,
//     images: [],
//   });

//   const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
//   const session = useSession();
//   const API_TOKEN = session?.data?.accessToken;

//   // Memoize modules to prevent unnecessary re-renders
//   const modules = useMemo(
//     () => ({
//       toolbar: [
//         [{ header: [1, 2, 3, 4, 5, 6, false] }],
//         ["bold", "italic", "underline", "strike"],
//         [{ list: "ordered" }, { list: "bullet" }],
//         [{ align: [] }],
//         ["clean"],
//       ],
//     }),
//     []
//   );

//   const formats = useMemo(
//     () => [
//       "header",
//       "bold",
//       "italic",
//       "underline",
//       "strike",
//       "list",
//       "bullet",
//       "align",
//     ],
//     []
//   );

//   // Fetch single resource data
//   const {
//     data: resourceData,
//     isLoading: isLoadingResource,
//     error: resourceError,
//   } = useQuery<ResourceData>({
//     queryKey: ["resource", slug],
//     queryFn: async () => {
//       const response = await fetch(`${API_BASE_URL}/api/v1/resource/${slug}`, {
//         headers: {
//           Authorization: `Bearer ${API_TOKEN}`,
//           "Content-Type": "application/json",
//         },
//       });
//       if (!response.ok) throw new Error("Failed to fetch resource");
//       const data = await response.json();
//       return data.data;
//     },
//     enabled: !!API_TOKEN && !!slug,
//     staleTime: 5 * 60 * 1000, // 5 minutes
//   });

//   const { data: countriesData, isLoading: isLoadingCountries } = useQuery<
//     Country[]
//   >({
//     queryKey: ["countries-all"],
//     queryFn: async () => {
//       const response = await fetch(`${API_BASE_URL}/api/v1/country-state/all`, {
//         headers: {
//           Authorization: `Bearer ${API_TOKEN}`,
//           "Content-Type": "application/json",
//         },
//       });
//       if (!response.ok) throw new Error("Failed to fetch countries");
//       const data = await response.json();
//       return data.success ? data.data : [];
//     },
//     enabled: !!API_TOKEN,
//     staleTime: 10 * 60 * 1000, // 10 minutes
//   });

//   const { data: practiceAreasData, isLoading: isLoadingPracticeAreas } =
//     useQuery<PracticeArea[]>({
//       queryKey: ["practiceAreas-all"],
//       queryFn: async () => {
//         const response = await fetch(
//           `${API_BASE_URL}/api/v1/practice-area/all`,
//           {
//             headers: {
//               Authorization: `Bearer ${API_TOKEN}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         if (!response.ok) throw new Error("Failed to fetch practice areas");
//         const data = await response.json();
//         return data.success ? data.data : [];
//       },
//       enabled: !!API_TOKEN,
//       staleTime: 10 * 60 * 1000, // 10 minutes
//     });

//   const singelPracticeArea = practiceAreasData?.find(
//     (p) => p.name.toLowerCase() === practiceArea.toLowerCase()
//   );

//   const handleCheckboxChange = (id: string, checked: boolean) => {
//     setSelectedSubAreas((prev) =>
//       checked ? [...prev, id] : prev.filter((item) => item !== id)
//     );
//   };


//   useEffect(() => {
//     if (singelPracticeArea) {
//       setPracticeArea(singelPracticeArea.name);
//     }
//   }, [singelPracticeArea]);


//   const { data: resourceTypesData, isLoading: isLoadingResourceTypes } =
//     useQuery<ResourceType[]>({
//       queryKey: ["resourceTypes-all"],
//       queryFn: async () => {
//         const response = await fetch(
//           `${API_BASE_URL}/api/v1/resource-type/all`,
//           {
//             headers: {
//               Authorization: `Bearer ${API_TOKEN}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         if (!response.ok) throw new Error("Failed to fetch resource types");
//         const data = await response.json();
//         return data.success ? data.data : [];
//       },
//       enabled: !!API_TOKEN,
//       staleTime: 10 * 60 * 1000, // 10 minutes
//     });

//   // Populate form data when resource data is loaded (only once)
//   useEffect(() => {
//     if (
//       resourceData &&
//       countriesData &&
//       practiceAreasData &&
//       resourceTypesData &&
//       !isFormInitialized
//     ) {
//       // Find matching country
//       const country = countriesData.find(
//         (c) => c.countryName === resourceData.country
//       );
//       if (country) {
//         setSelectedCountry(country);
//       }

//       // Find matching practice area
//       const practiceArea = practiceAreasData.find((pa) =>
//         resourceData.practiceAreas.includes(pa.name)
//       );

//       // Find matching resource type
//       const resourceType = resourceTypesData.find((rt) =>
//         resourceData.resourceType.includes(rt.resourceTypeName)
//       );

//       // Set form data in one batch update
//       setFormData({
//         title: resourceData.title || "",
//         price: resourceData.price?.toString() || "",
//         discountPrice: resourceData.discountPrice?.toString() || "",
//         quantity: resourceData.quantity?.toString() || "",
//         format: resourceData.format || "",
//         country: resourceData.country || "",
//         states: resourceData.states || [],
//         description: resourceData.description || "",
//         practiceArea: practiceArea?._id || "",
//         productStatus: "",
//         resourceType: resourceType?._id || "",
//         thumbnail: null,
//         file: null,
//         images: [],
//       });

//       setSelectedStates(resourceData.states || []);
//       setExistingImages(resourceData.images || []);
//       setExistingThumbnail(resourceData.thumbnail || null);
//       setExistingFile(resourceData.file || null);
//       setIsFormInitialized(true);
//     }
//   }, [
//     resourceData,
//     countriesData,
//     practiceAreasData,
//     resourceTypesData,
//     isFormInitialized,
//   ]);

//   const { mutate: updateResource, isPending: isSubmitting } = useMutation({
//     mutationFn: async (currentFormData: FormDataState) => {
//       console.log("Submitting resource with data:", currentFormData);
//       const submitData = new FormData();
//       submitData.append("title", currentFormData.title);
//       submitData.append("description", currentFormData.description);
//       submitData.append("price", currentFormData.price);
//       submitData.append("discountPrice", currentFormData.discountPrice);
//       submitData.append("format", currentFormData.format);
//       submitData.append("quantity", currentFormData.quantity);
//       submitData.append("country", currentFormData.country);
//       submitData.append("productStatus", currentFormData.productStatus);
//       selectedSubAreas.forEach((subAreaId) => {
//         submitData.append("subPracticeAreas[]", subAreaId);
//       });
//       // submitData.append("subPracticeAreas", JSON.stringify(selectedSubAreas));

//       currentFormData.states.forEach((state) => {
//         submitData.append("states[]", state);
//       });

//       const practiceAreaObj = practiceAreasData?.find(
//         (p) => p._id === currentFormData.practiceArea
//       );
//       if (practiceAreaObj) {
//         submitData.append("practiceAreas[]", practiceAreaObj.name);
//       } else if (currentFormData.practiceArea) {
//         submitData.append("practiceAreas[]", currentFormData.practiceArea);
//       }

//       const resourceTypeObj = resourceTypesData?.find(
//         (rt) => rt._id === currentFormData.resourceType
//       );
//       if (resourceTypeObj) {
//         submitData.append("resourceType[]", resourceTypeObj.resourceTypeName);
//       } else if (currentFormData.resourceType) {
//         submitData.append("resourceType[]", currentFormData.resourceType);
//       }

//       if (currentFormData.thumbnail) {
//         submitData.append("thumbnail", currentFormData.thumbnail);
//       }
//       if (currentFormData.file) {
//         submitData.append("file", currentFormData.file);
//       }

//       currentFormData.images.forEach((imageFile) => {
//         submitData.append("images", imageFile);
//       });

//       const response = await fetch(`${API_BASE_URL}/api/v1/resource/${slug}`, {
//         method: "PUT",
//         headers: { Authorization: `Bearer ${API_TOKEN}` },
//         body: submitData,
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(
//           `Failed to update resource: ${errorData.message || response.statusText
//           }`
//         );
//       }
//       return response.json();
//     },
//     onMutate: async (currentFormData) => {
//       // Cancel any outgoing refetches for both individual resource and list
//       await queryClient.cancelQueries({ queryKey: ["resource", slug] });
//       await queryClient.cancelQueries({ queryKey: ["resources", "approved"] });

//       // Snapshot the previous values
//       const previousResource = queryClient.getQueryData(["resource", slug]);
//       const previousResourcesList = queryClient.getQueryData([
//         "resources",
//         "approved",
//       ]);

//       // Optimistically update the individual resource
//       if (resourceData) {
//         const optimisticResource = {
//           ...resourceData,
//           title: currentFormData.title,
//           price: Number(currentFormData.price),
//           discountPrice: Number(currentFormData.discountPrice),
//           quantity: Number(currentFormData.quantity),
//           format: currentFormData.format,
//           country: currentFormData.country,
//           states: currentFormData.states,
//           description: currentFormData.description,
//         };
//         queryClient.setQueryData(["resource", slug], optimisticResource);
//       }

//       // Return context for rollback
//       return { previousResource, previousResourcesList };
//     },
//     onError: (err, variables, context) => {
//       // Rollback on error
//       if (context?.previousResource) {
//         queryClient.setQueryData(["resource", slug], context.previousResource);
//       }
//       if (context?.previousResourcesList) {
//         queryClient.setQueryData(
//           ["resources", "approved"],
//           context.previousResourcesList
//         );
//       }

//       console.error("Error updating resource:", err);
//       toast({
//         title: "Error",
//         description:
//           err.message || "Failed to update resource. Please try again.",
//         variant: "destructive",
//       });
//     },
//     onSuccess: (data) => {
//       console.log("Resource updated successfully:", data);

//       // Invalidate all related queries to ensure fresh data
//       queryClient.invalidateQueries({ queryKey: ["resource", slug] });
//       queryClient.invalidateQueries({ queryKey: ["resources", "approved"] });
//       queryClient.invalidateQueries({ queryKey: ["resources"] }); // Invalidate any other resource queries

//       // Refetch the list immediately to ensure it's updated
//       queryClient.refetchQueries({ queryKey: ["resources", "approved"] });

//       toast({
//         title: "Success!",
//         description: "Resource has been updated successfully.",
//         variant: "default",
//       });

//       // Optional: Navigate back to list after successful update
//       // setTimeout(() => {
//       //   router.push('/resource-list')
//       // }, 1500)
//     },
//     onSettled: () => {
//       // Always refetch after error or success to ensure we have the latest data
//       queryClient.invalidateQueries({ queryKey: ["resource", slug] });
//       queryClient.invalidateQueries({ queryKey: ["resources", "approved"] });
//     },
//   });

//   // Optimized input change handler
//   const handleInputChange = useCallback(
//     (field: keyof FormDataState, value: string) => {
//       setFormData((prev) => ({ ...prev, [field]: value }));
//     },
//     []
//   );

//   const handleCountrySelect = useCallback((country: Country) => {
//     setSelectedCountry(country);
//     setSelectedStates([]);
//     setFormData((prev) => ({
//       ...prev,
//       country: country.countryName,
//       states: [],
//     }));
//     setCountryOpen(false);
//   }, []);

//   const handleStateToggle = useCallback(
//     (state: string) => {
//       const newStates = selectedStates.includes(state)
//         ? selectedStates.filter((s) => s !== state)
//         : [...selectedStates, state];
//       setSelectedStates(newStates);
//       setFormData((prev) => ({ ...prev, states: newStates }));
//     },
//     [selectedStates]
//   );

//   const handleThumbnailUpload = useCallback(
//     (event: React.ChangeEvent<HTMLInputElement>) => {
//       const file = event.target.files?.[0] || null;

//       if (thumbnailPreview) {
//         URL.revokeObjectURL(thumbnailPreview);
//       }

//       if (file) {
//         if (!file.type.startsWith("image/")) {
//           toast({
//             title: "Invalid file type",
//             description: "Please upload only image files for thumbnail.",
//             variant: "destructive",
//           });
//           setFormData((prev) => ({ ...prev, thumbnail: null }));
//           setThumbnailPreview(null);
//           if (thumbnailInputRef.current) {
//             thumbnailInputRef.current.value = "";
//           }
//           return;
//         }
//         setFormData((prev) => ({ ...prev, thumbnail: file }));
//         setThumbnailPreview(URL.createObjectURL(file));
//       } else {
//         setFormData((prev) => ({ ...prev, thumbnail: null }));
//         setThumbnailPreview(null);
//         if (thumbnailInputRef.current) {
//           thumbnailInputRef.current.value = "";
//         }
//       }
//     },
//     [thumbnailPreview, toast]
//   );

//   const handleRemoveThumbnail = useCallback(() => {
//     if (thumbnailPreview) {
//       URL.revokeObjectURL(thumbnailPreview);
//     }
//     setThumbnailPreview(null);
//     setFormData((prev) => ({ ...prev, thumbnail: null }));
//     if (thumbnailInputRef.current) {
//       thumbnailInputRef.current.value = "";
//     }
//   }, [thumbnailPreview]);

//   const handleFileUpload = useCallback(
//     (event: React.ChangeEvent<HTMLInputElement>) => {
//       const uploadedFile = event.target.files?.[0] || null;
//       setFormData((prev) => ({
//         ...prev,
//         file: uploadedFile,
//       }));
//     },
//     []
//   );

//   const handleImagesUpload = useCallback(
//     (event: React.ChangeEvent<HTMLInputElement>) => {
//       const files = event.target.files;
//       if (files) {
//         const newFiles = Array.from(files);
//         const imageFiles = newFiles.filter((file) =>
//           file.type.startsWith("image/")
//         );

//         if (imageFiles.length !== newFiles.length) {
//           toast({
//             title: "Invalid file type",
//             description: "Some files were not images and were not added.",
//             variant: "destructive",
//           });
//         }

//         setFormData((prev) => ({
//           ...prev,
//           images: [...prev.images, ...imageFiles],
//         }));
//         setImagePreviews((prev) => [
//           ...prev,
//           ...imageFiles.map((file) => URL.createObjectURL(file)),
//         ]);
//       }
//       if (event.target) {
//         event.target.value = "";
//       }
//     },
//     [toast]
//   );

//   const handleRemoveImage = useCallback(
//     (indexToRemove: number) => {
//       URL.revokeObjectURL(imagePreviews[indexToRemove]);
//       setImagePreviews((prev) =>
//         prev.filter((_, index) => index !== indexToRemove)
//       );
//       setFormData((prev) => ({
//         ...prev,
//         images: prev.images.filter((_, index) => index !== indexToRemove),
//       }));
//     },
//     [imagePreviews]
//   );

//   const handleRemoveExistingImage = useCallback((indexToRemove: number) => {
//     setExistingImages((prev) =>
//       prev.filter((_, index) => index !== indexToRemove)
//     );
//   }, []);

//   const handleSubmit = useCallback((action: "publish" | "draft") => {


//     const formDataToSubmit: FormDataState = {
//       ...formData,
//       productStatus: action === "publish" ? "approved" : "draft",
//     };


//     updateResource(formDataToSubmit);
//   }, [updateResource, formData]);

//   // Memoize filtered states to prevent unnecessary recalculations
//   const filteredStates = useMemo(
//     () =>
//       selectedCountry?.states.filter((state) =>
//         state.toLowerCase().includes(stateSearch.toLowerCase())
//       ) || [],
//     [selectedCountry?.states, stateSearch]
//   );

//   useEffect(() => {
//     return () => {
//       if (thumbnailPreview) {
//         URL.revokeObjectURL(thumbnailPreview);
//       }
//       imagePreviews.forEach((previewUrl) => URL.revokeObjectURL(previewUrl));
//     };
//   }, [thumbnailPreview, imagePreviews]);

//   if (isLoadingResource) {
//     return (
//       <div className="max-w-9xl mx-auto p-6">
//         <div className="flex items-center justify-center min-h-[400px]">
//           <div className="flex items-center space-x-2">
//             <Loader2 className="h-6 w-6 animate-spin" />
//             <span>Loading resource data...</span>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (resourceError) {
//     return (
//       <div className="max-w-9xl mx-auto p-6">
//         <div className="flex items-center justify-center min-h-[400px]">
//           <div className="text-center">
//             <h2 className="text-xl font-semibold text-red-600 mb-2">
//               Error Loading Resource
//             </h2>
//             <p className="text-gray-600">
//               Failed to load resource data. Please try again.
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="mt-6 px-6">
//         <PageHeader
//           // onButtonClick={handleAddResource}
//           title="Resource List Edit"
//         // buttonText="Add Resource"
//         />
//         <p className="text-gray-500 -mt-4">Dashboard &gt; Resource List</p>
//       </div>
//       <div className="max-w-9xl mx-auto p-6">
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//           {/* Left Section */}
//           <div className="lg:col-span-3">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-xl font-semibold">
//                   Edit Resource
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 <div className="space-y-2">
//                   <Label htmlFor="title" className="text-base">
//                     Title
//                   </Label>
//                   <Input
//                     id="title"
//                     className="h-[49px] border border-gray-500"
//                     placeholder="Add your title..."
//                     value={formData.title}
//                     onChange={(e) => handleInputChange("title", e.target.value)}
//                   />
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="price" className="text-base font-semibold">
//                       Price
//                     </Label>
//                     <Input
//                       className="h-[49px] border border-gray-500"
//                       id="price"
//                       placeholder="Add price.."
//                       value={formData.price}
//                       onChange={(e) =>
//                         handleInputChange("price", e.target.value)
//                       }
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label
//                       className="text-base font-semibold"
//                       htmlFor="discountPrice"
//                     >
//                       Discount Price
//                     </Label>
//                     <Input
//                       id="discountPrice"
//                       className="h-[49px] border border-gray-500"
//                       placeholder="Add Discount Price.."
//                       value={formData.discountPrice}
//                       onChange={(e) =>
//                         handleInputChange("discountPrice", e.target.value)
//                       }
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label
//                       className="text-base font-semibold"
//                       htmlFor="quantity"
//                     >
//                       Quantity
//                     </Label>
//                     <Input
//                       id="quantity"
//                       className="h-[49px] border border-gray-500"
//                       placeholder="Add Quantity.."
//                       value={formData.quantity}
//                       onChange={(e) =>
//                         handleInputChange("quantity", e.target.value)
//                       }
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label className="text-base font-semibold" htmlFor="format">
//                       Format
//                     </Label>
//                     <Select
//                       value={formData.format}
//                       onValueChange={(value) =>
//                         handleInputChange("format", value)
//                       }
//                     >
//                       <SelectTrigger className="h-[49px] border border-gray-500">
//                         <SelectValue placeholder="Add format.." />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="PDF">PDF</SelectItem>
//                         <SelectItem value="Document">Doc</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label>Country</Label>
//                     <Popover open={countryOpen} onOpenChange={setCountryOpen}>
//                       <PopoverTrigger asChild>
//                         <Button
//                           variant="outline"
//                           role="combobox"
//                           aria-expanded={countryOpen}
//                           className="w-full justify-between h-[49px] border"
//                           disabled={isLoadingCountries}
//                         >
//                           {selectedCountry
//                             ? selectedCountry.countryName
//                             : "Select country..."}
//                           <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
//                         </Button>
//                       </PopoverTrigger>
//                       <PopoverContent className="w-full p-0">
//                         <Command>
//                           <CommandInput placeholder="Search country..." />
//                           <CommandList>
//                             <CommandEmpty>No country found.</CommandEmpty>
//                             <CommandGroup>
//                               {countriesData?.map((country: Country) => (
//                                 <CommandItem
//                                   key={country._id}
//                                   value={country.countryName}
//                                   onSelect={() => handleCountrySelect(country)}
//                                 >
//                                   <Check
//                                     className={cn(
//                                       "mr-2 h-4 w-4",
//                                       selectedCountry?._id === country._id
//                                         ? "opacity-100"
//                                         : "opacity-0"
//                                     )}
//                                   />
//                                   {country.countryName}
//                                 </CommandItem>
//                               ))}
//                             </CommandGroup>
//                           </CommandList>
//                         </Command>
//                       </PopoverContent>
//                     </Popover>
//                   </div>
//                   <div className="space-y-2">
//                     <Label>States</Label>
//                     <Popover open={stateOpen} onOpenChange={setStateOpen}>
//                       <PopoverTrigger asChild>
//                         <Button
//                           variant="outline"
//                           role="combobox"
//                           aria-expanded={stateOpen}
//                           className="w-full justify-between h-[49px] border"
//                           disabled={!selectedCountry}
//                         >
//                           {selectedStates.length > 0
//                             ? `${selectedStates.length} state(s) selected`
//                             : "Select states..."}
//                           <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
//                         </Button>
//                       </PopoverTrigger>
//                       <PopoverContent className="w-full p-0">
//                         <Command>
//                           <CommandInput
//                             placeholder="Search states..."
//                             value={stateSearch}
//                             onValueChange={setStateSearch}
//                           />
//                           <CommandList>
//                             <CommandEmpty>No state found.</CommandEmpty>
//                             <CommandGroup>
//                               {filteredStates.map((state) => (
//                                 <CommandItem
//                                   key={state}
//                                   value={state}
//                                   onSelect={() => handleStateToggle(state)}
//                                 >
//                                   <Check
//                                     className={cn(
//                                       "mr-2 h-4 w-4",
//                                       selectedStates.includes(state)
//                                         ? "opacity-100"
//                                         : "opacity-0"
//                                     )}
//                                   />
//                                   {state}
//                                 </CommandItem>
//                               ))}
//                             </CommandGroup>
//                           </CommandList>
//                         </Command>
//                       </PopoverContent>
//                     </Popover>
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="description">Description</Label>
//                   <div className="rounded-md border border-gray-300 h-[300px] overflow-hidden">
//                     {typeof window !== "undefined" && (
//                       <ReactQuill
//                         theme="snow"
//                         value={formData.description}
//                         onChange={(content) =>
//                           handleInputChange("description", content)
//                         }
//                         modules={modules}
//                         formats={formats}
//                         className="h-[300px] rounded-md"
//                         style={{ height: "300px" }}
//                       />
//                     )}
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Right Sidebar */}
//           <div className="space-y-6">
//             {/* Practice Area & Resource Type */}

//             <Card>
//               <CardContent className="pt-6">
//                 <div className="space-y-2">
//                   <Label className="text-base font-semibold">
//                     Practice Area
//                   </Label>
//                   <Select
//                     value={formData.practiceArea}
//                     onValueChange={(value) => {
//                       handleInputChange("practiceArea", value);
//                       const selectedArea = practiceAreasData?.find(
//                         (area) => area._id === value
//                       );
//                       setPracticeArea(selectedArea ? selectedArea.name : value);
//                     }}
//                   >
//                     <SelectTrigger className="h-[49px] border border-gray-400">
//                       <SelectValue placeholder="Select a practice area" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {isLoadingPracticeAreas ? (
//                         <SelectItem value="loading" disabled>
//                           Loading...
//                         </SelectItem>
//                       ) : (
//                         practiceAreasData?.map((area: PracticeArea) => (
//                           <SelectItem key={area._id} value={area._id}>
//                             {area.name}
//                           </SelectItem>
//                         ))
//                       )}
//                     </SelectContent>
//                   </Select>
//                 </div>


//                 {/* {singelPracticeArea && singelPracticeArea.subPracticeAreas?.map((subArea) => (
//                   <div key={subArea._id} className="mt-2">
//                     <Label className="text-sm font-medium">
//                       {subArea.name}
//                     </Label>
//                   </div>
//                 ))
//                 } */}

//                 <div>
//                   {singelPracticeArea?.subPracticeAreas?.map((subArea: { _id: string; name: string }) => (
//                     <div key={subArea._id} className="flex items-center space-x-2 mt-2">
//                       <Checkbox
//                         id={subArea.name}
//                         checked={selectedSubAreas.includes(subArea.name)}
//                         onCheckedChange={(checked: boolean | "indeterminate") =>
//                           handleCheckboxChange(subArea.name, Boolean(checked))
//                         }
//                       />
//                       <Label htmlFor={subArea.name} className="text-sm font-medium">
//                         {subArea.name}
//                       </Label>
//                     </div>
//                   ))}

//                   {/* Debug output or pass to form submission */}
//                   {/* <div className="mt-4 text-sm text-gray-500">
//                     Selected SubPracticeAreas:{" "}
//                     <pre>{JSON.stringify(selectedSubAreas, null, 2)}</pre>
//                   </div> */}
//                 </div>



//                 <div className="space-y-2 mt-4">
//                   <Label className="text-base font-semibold">
//                     Resource Type
//                   </Label>
//                   <Select
//                     value={formData.resourceType}
//                     onValueChange={(value) =>
//                       handleInputChange("resourceType", value)
//                     }
//                   >
//                     <SelectTrigger className="h-[49px] border border-gray-400">
//                       <SelectValue placeholder="Select a resource type" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {isLoadingResourceTypes ? (
//                         <SelectItem value="loading" disabled>
//                           Loading...
//                         </SelectItem>
//                       ) : (
//                         resourceTypesData?.map((type: ResourceType) => (
//                           <SelectItem key={type._id} value={type._id}>
//                             {type.resourceTypeName}
//                           </SelectItem>
//                         ))
//                       )}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Thumbnail */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Thumbnail</CardTitle>
//               </CardHeader>
//               <CardContent className="pt-6">
//                 <div className="space-y-2">
//                   <Label htmlFor="thumbnail-upload">
//                     Thumbnail (Images Only)
//                   </Label>

//                   {/* Show existing thumbnail */}
//                   {existingThumbnail && !thumbnailPreview && (
//                     <div className="mb-4">
//                       <p className="text-sm text-gray-600 mb-2">
//                         Current thumbnail:
//                       </p>
//                       <div className="relative">
//                         <Image
//                           width={200}
//                           height={150}
//                           src={existingThumbnail || "/placeholder.svg"}
//                           alt="Current thumbnail"
//                           className="max-h-40 w-auto rounded-md object-contain"
//                         />
//                       </div>
//                     </div>
//                   )}

//                   <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={handleThumbnailUpload}
//                       className="hidden"
//                       id="thumbnail-upload"
//                       ref={thumbnailInputRef}
//                     />
//                     {formData.thumbnail && thumbnailPreview ? (
//                       <div className="space-y-3">
//                         <Image
//                           width={100}
//                           height={100}
//                           src={thumbnailPreview || "/placeholder.svg"}
//                           alt="New thumbnail preview"
//                           className="max-h-40 w-auto mx-auto rounded-md object-contain"
//                         />
//                         <p
//                           className="text-sm text-gray-600 truncate"
//                           title={formData.thumbnail.name}
//                         >
//                           {formData.thumbnail.name}
//                         </p>
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={handleRemoveThumbnail}
//                           className="w-full text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700"
//                         >
//                           <X className="mr-2 h-4 w-4" /> Remove New Image
//                         </Button>
//                       </div>
//                     ) : (
//                       <label
//                         htmlFor="thumbnail-upload"
//                         className="cursor-pointer flex flex-col items-center justify-center space-y-2 py-4"
//                       >
//                         <ImageIcon className="h-12 w-12 text-gray-400" />
//                         <p className="text-sm text-gray-600">
//                           {existingThumbnail
//                             ? "Click to replace thumbnail"
//                             : "Click or drag to upload"}
//                         </p>
//                         <p className="text-xs text-gray-500">
//                           PNG, JPG, GIF up to 5MB
//                         </p>
//                       </label>
//                     )}
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//             {/* File Upload */}
//             <Card>
//               <CardContent className="pt-6">
//                 <div className="space-y-2">
//                   <Label>File (PDF, Word, etc.)</Label>

//                   {/* Show existing file */}
//                   {existingFile && !formData.file && (
//                     <div className="mb-4 p-3 bg-gray-50 rounded-md">
//                       <p className="text-sm text-gray-600 mb-1">
//                         Current file:
//                       </p>
//                       <a
//                         href={existingFile.url}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-blue-600 hover:text-blue-800 text-sm underline"
//                       >
//                         View current file ({existingFile.type})
//                       </a>
//                     </div>
//                   )}

//                   <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
//                     <input
//                       type="file"
//                       accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
//                       onChange={handleFileUpload}
//                       className="hidden"
//                       id="file-upload"
//                     />
//                     <label htmlFor="file-upload" className="cursor-pointer">
//                       <FileText className="mx-auto h-12 w-12 text-gray-400" />
//                       <p className="mt-2 text-sm text-gray-600">
//                         {formData.file
//                           ? formData.file.name
//                           : existingFile
//                             ? "Click to replace file"
//                             : "Click to upload file"}
//                       </p>
//                     </label>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Multiple Images Upload */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Images</CardTitle>
//               </CardHeader>
//               <CardContent className="pt-6">
//                 <div className="space-y-2">
//                   <Label htmlFor="images-upload">Additional Images</Label>

//                   {/* Show existing images */}
//                   {existingImages.length > 0 && (
//                     <div className="mb-4">
//                       <p className="text-sm text-gray-600 mb-2">
//                         Current images:
//                       </p>
//                       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//                         {existingImages.map((imageUrl, index) => (
//                           <div key={index} className="relative group">
//                             <Image
//                               src={imageUrl || "/placeholder.svg"}
//                               alt={`Existing image ${index + 1}`}
//                               width={100}
//                               height={100}
//                               className="w-full h-24 object-cover rounded-md"
//                             />
//                             <Button
//                               variant="destructive"
//                               size="icon"
//                               className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
//                               onClick={() => handleRemoveExistingImage(index)}
//                             >
//                               <X className="h-4 w-4" />
//                             </Button>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
//                     <input
//                       type="file"
//                       accept="image/*"
//                       multiple
//                       onChange={handleImagesUpload}
//                       className="hidden"
//                       id="images-upload"
//                     />
//                     <label
//                       htmlFor="images-upload"
//                       className="cursor-pointer flex flex-col items-center justify-center space-y-2 py-4"
//                     >
//                       <ImageIcon className="h-12 w-12 text-gray-400" />
//                       <p className="text-sm text-gray-600">
//                         Click or drag to upload new images
//                       </p>
//                       <p className="text-xs text-gray-500">
//                         PNG, JPG, GIF up to 5MB each
//                       </p>
//                     </label>
//                   </div>

//                   {/* Show new images to be uploaded */}
//                   {imagePreviews.length > 0 && (
//                     <div className="mt-4">
//                       <p className="text-sm text-gray-600 mb-2">
//                         New images to upload:
//                       </p>
//                       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//                         {imagePreviews.map((previewUrl, index) => (
//                           <div key={index} className="relative group">
//                             <Image
//                               src={previewUrl || "/placeholder.svg"}
//                               alt={`New preview ${index + 1}`}
//                               width={100}
//                               height={100}
//                               className="w-full h-24 object-cover rounded-md"
//                             />
//                             <Button
//                               variant="destructive"
//                               size="icon"
//                               className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
//                               onClick={() => handleRemoveImage(index)}
//                             >
//                               <X className="h-4 w-4" />
//                             </Button>
//                             <p
//                               className="text-xs text-gray-500 truncate mt-1"
//                               title={formData.images[index]?.name}
//                             >
//                               {formData.images[index]?.name}
//                             </p>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>
//             <Button className="w-full" onClick={() => setPreviewOpen(true)}>
//               Preview
//             </Button>
//             {/* Submit Button */}
//             <div className="flex gap-4 items-center justify-center">
//               <Button
//                 onClick={() => handleSubmit("publish")}
//                 className="w-full"
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting ? "Publishing..." : "Publish Resources"}
//               </Button>

//               <Button
//                 onClick={() => handleSubmit("draft")}
//                 className="w-full"
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting ? "Drafting..." : " Draft"}
//               </Button>
//             </div>
//           </div>
//         </div>
//         <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
//           <DialogContent className="max-w-2xl">
//             <DialogHeader>
//               <DialogTitle>Preview Data</DialogTitle>
//             </DialogHeader>
//             <div className="space-y-3">
//               <p><strong>Title:</strong> {formData.title}</p>
//               <p><strong>Price:</strong> {formData.price}</p>
//               <p><strong>Discount Price:</strong> {formData.discountPrice}</p>
//               <p><strong>Quantity:</strong> {formData.quantity}</p>
//               <p><strong>Format:</strong> {formData.format}</p>
//               <p><strong>Country:</strong> {formData.country}</p>
//               <p><strong>Product Status:</strong> {formData.productStatus}</p>
//               <p><strong>States:</strong> {formData.states.join(", ")}</p>
//               <p><strong>Description:</strong> {formData.description}</p>
//               <p><strong>Practice Area:</strong> {practiceArea}</p>
//               {/* <p><strong>Resource Type:</strong> {resourcePreview}</p> */}

//               {/* Thumbnail Preview */}
//               {formData.thumbnail && (
//                 <div>
//                   <strong>Thumbnail:</strong>
//                   <Image
//                     width={100}
//                     height={100}
//                     src={URL.createObjectURL(formData.thumbnail)}
//                     alt="Thumbnail Preview"
//                     className="w-32 h-32 object-cover border"
//                   />
//                 </div>
//               )}

//               {/* File Name */}
//               {formData.file && (
//                 <p><strong>File:</strong> {formData.file.name}</p>
//               )}

//               {/* Images Preview */}
//               {formData.images.length > 0 && (
//                 <div>
//                   <strong>Images:</strong>
//                   <div className="flex gap-2 flex-wrap">
//                     {formData.images.map((img, idx) => (
//                       <Image
//                         width={100}
//                         height={100}
//                         key={idx}
//                         src={URL.createObjectURL(img)}
//                         alt={`Image ${idx + 1}`}
//                         className="w-24 h-24 object-cover border"
//                       />
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </DialogContent>
//         </Dialog>
//       </div>
//     </div>
//   );
// }







"use client";

import type React from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Check,
  ChevronDown,
  FileText,
  ImageIcon,
  X,
  Loader2,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import "react-quill/dist/quill.snow.css";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { PageHeader } from "@/components/page-header";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Import React Quill dynamically to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

// Updated interfaces to match API response
interface Division {
  divisionName: string;
}

interface State {
  stateName: string;
  divisions: Division[];
}

interface Country {
  _id: string;
  countryName: string;
  states: State[];
}

interface PracticeArea {
  _id: string;
  name: string;
  description: string;
  subPracticeAreas?: { _id: string; name: string }[];
}

interface ResourceType {
  _id: string;
  resourceTypeName: string;
  description: string;
}

interface ResourceData {
  _id: string;
  title: string;
  country: string;
  states: string[];
  divisions: string[]; // Added divisions
  resourceType: string[];
  description: string;
  price: number;
  discountPrice: number;
  quantity: number;
  format: string;
  thumbnail: string;
  images: string[];
  productStatus: string;
  practiceAreas: string[];
  file: {
    url: string;
    type: string;
  };
}

interface FormDataState {
  title: string;
  price: string;
  discountPrice: string;
  quantity: string;
  format: string;
  country: string;
  states: string[];
  divisions: string[]; // Added divisions
  description: string;
  practiceArea: string;
  productStatus: string;
  resourceType: string;
  thumbnail: File | null;
  file: File | null;
  images: File[];
}

export default function EditPage() {
  const params = useParams();
  const slug = params.id as string;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedDivisions, setSelectedDivisions] = useState<string[]>([]); // New state for divisions
  const [countryOpen, setCountryOpen] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);
  const [divisionOpen, setDivisionOpen] = useState(false); // New state for division popover
  const [stateSearch, setStateSearch] = useState("");
  const [divisionSearch, setDivisionSearch] = useState(""); // New state for division search
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [selectedSubAreas, setSelectedSubAreas] = useState<string[]>([]);
  const [practiceArea, setPracticeArea] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [existingThumbnail, setExistingThumbnail] = useState<string | null>(null);
  const [existingFile, setExistingFile] = useState<{
    url: string;
    type: string;
  } | null>(null);
  const [isFormInitialized, setIsFormInitialized] = useState(false);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormDataState>({
    title: "",
    price: "",
    discountPrice: "",
    quantity: "",
    format: "",
    productStatus: "",
    country: "",
    states: [],
    divisions: [], // Initialize divisions
    description: "",
    practiceArea: "",
    resourceType: "",
    thumbnail: null,
    file: null,
    images: [],
  });

  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const session = useSession();
  const API_TOKEN = session?.data?.accessToken;

  // Memoize modules to prevent unnecessary re-renders
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],
        ["clean"],
      ],
    }),
    []
  );

  const formats = useMemo(
    () => [
      "header",
      "bold",
      "italic",
      "underline",
      "strike",
      "list",
      "bullet",
      "align",
    ],
    []
  );

  // Fetch single resource data
  const {
    data: resourceData,
    isLoading: isLoadingResource,
    error: resourceError,
  } = useQuery<ResourceData>({
    queryKey: ["resource", slug],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/api/v1/resource/${slug}`, {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch resource");
      const data = await response.json();
      return data.data;
    },
    enabled: !!API_TOKEN && !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: countriesData, isLoading: isLoadingCountries } = useQuery<
    Country[]
  >({
    queryKey: ["countries-all"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/api/v1/country-state/all`, {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch countries");
      const data = await response.json();
      return data.success ? data.data : [];
    },
    enabled: !!API_TOKEN,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const { data: practiceAreasData, isLoading: isLoadingPracticeAreas } =
    useQuery<PracticeArea[]>({
      queryKey: ["practiceAreas-all"],
      queryFn: async () => {
        const response = await fetch(
          `${API_BASE_URL}/api/v1/practice-area/all`,
          {
            headers: {
              Authorization: `Bearer ${API_TOKEN}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch practice areas");
        const data = await response.json();
        return data.success ? data.data : [];
      },
      enabled: !!API_TOKEN,
      staleTime: 10 * 60 * 1000, // 10 minutes
    });

  const singelPracticeArea = practiceAreasData?.find(
    (p) => p.name.toLowerCase() === practiceArea.toLowerCase()
  );

  const handleCheckboxChange = useCallback(
    (id: string, checked: boolean) => {
      setSelectedSubAreas((prev) =>
        checked ? [...prev, id] : prev.filter((item) => item !== id)
      );
    },
    []
  );

  useEffect(() => {
    if (singelPracticeArea) {
      setPracticeArea(singelPracticeArea.name);
    }
  }, [singelPracticeArea]);

  const { data: resourceTypesData, isLoading: isLoadingResourceTypes } =
    useQuery<ResourceType[]>({
      queryKey: ["resourceTypes-all"],
      queryFn: async () => {
        const response = await fetch(
          `${API_BASE_URL}/api/v1/resource-type/all`,
          {
            headers: {
              Authorization: `Bearer ${API_TOKEN}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch resource types");
        const data = await response.json();
        return data.success ? data.data : [];
      },
      enabled: !!API_TOKEN,
      staleTime: 10 * 60 * 1000, // 10 minutes
    });

  // Populate form data when resource data is loaded (only once)
  useEffect(() => {
    if (
      resourceData &&
      countriesData &&
      practiceAreasData &&
      resourceTypesData &&
      !isFormInitialized
    ) {
      // Find matching country
      const country = countriesData.find(
        (c) => c.countryName === resourceData.country
      );
      if (country) {
        setSelectedCountry(country);
      }

      // Find matching practice area
      const practiceArea = practiceAreasData.find((pa) =>
        resourceData.practiceAreas.includes(pa.name)
      );

      // Find matching resource type
      const resourceType = resourceTypesData.find((rt) =>
        resourceData.resourceType.includes(rt.resourceTypeName)
      );

      // Set form data in one batch update
      setFormData({
        title: resourceData.title || "",
        price: resourceData.price?.toString() || "",
        discountPrice: resourceData.discountPrice?.toString() || "",
        quantity: resourceData.quantity?.toString() || "",
        format: resourceData.format || "",
        country: resourceData.country || "",
        states: resourceData.states || [],
        divisions: resourceData.divisions || [], // Initialize divisions
        description: resourceData.description || "",
        practiceArea: practiceArea?._id || "",
        productStatus: resourceData.productStatus || "",
        resourceType: resourceType?._id || "",
        thumbnail: null,
        file: null,
        images: [],
      });

      setSelectedStates(resourceData.states || []);
      setSelectedDivisions(resourceData.divisions || []); // Set divisions
      setExistingImages(resourceData.images || []);
      setExistingThumbnail(resourceData.thumbnail || null);
      setExistingFile(resourceData.file || null);
      setIsFormInitialized(true);
    }
  }, [
    resourceData,
    countriesData,
    practiceAreasData,
    resourceTypesData,
    isFormInitialized,
  ]);

  // Update resource mutation
  const { mutate: updateResource, isPending: isSubmitting } = useMutation({
    mutationFn: async (currentFormData: FormDataState) => {
      console.log("Submitting resource with data:", currentFormData);
      const submitData = new FormData();
      submitData.append("title", currentFormData.title);
      submitData.append("description", currentFormData.description);
      submitData.append("price", currentFormData.price);
      submitData.append("discountPrice", currentFormData.discountPrice);
      submitData.append("format", currentFormData.format);
      submitData.append("quantity", currentFormData.quantity);
      submitData.append("country", currentFormData.country);
      submitData.append("productStatus", currentFormData.productStatus);
      currentFormData.states.forEach((state) => {
        submitData.append("states[]", state);
      });
      currentFormData.divisions.forEach((division) => {
        submitData.append("divisions[]", division); // Add divisions to submission
      });
      selectedSubAreas.forEach((subAreaId) => {
        submitData.append("subPracticeAreas[]", subAreaId);
      });

      const practiceAreaObj = practiceAreasData?.find(
        (p) => p._id === currentFormData.practiceArea
      );
      if (practiceAreaObj) {
        submitData.append("practiceAreas[]", practiceAreaObj.name);
      } else if (currentFormData.practiceArea) {
        submitData.append("practiceAreas[]", currentFormData.practiceArea);
      }

      const resourceTypeObj = resourceTypesData?.find(
        (rt) => rt._id === currentFormData.resourceType
      );
      if (resourceTypeObj) {
        submitData.append("resourceType[]", resourceTypeObj.resourceTypeName);
      } else if (currentFormData.resourceType) {
        submitData.append("resourceType[]", currentFormData.resourceType);
      }

      if (currentFormData.thumbnail) {
        submitData.append("thumbnail", currentFormData.thumbnail);
      }
      if (currentFormData.file) {
        submitData.append("file", currentFormData.file);
      }

      currentFormData.images.forEach((imageFile) => {
        submitData.append("images", imageFile);
      });

      const response = await fetch(`${API_BASE_URL}/api/v1/resource/${slug}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${API_TOKEN}` },
        body: submitData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Failed to update resource: ${errorData.message || response.statusText}`
        );
      }
      return response.json();
    },
    onMutate: async (currentFormData) => {
      // Cancel any outgoing refetches for both individual resource and list
      await queryClient.cancelQueries({ queryKey: ["resource", slug] });
      await queryClient.cancelQueries({ queryKey: ["resources", "approved"] });

      // Snapshot the previous values
      const previousResource = queryClient.getQueryData(["resource", slug]);
      const previousResourcesList = queryClient.getQueryData([
        "resources",
        "approved",
      ]);

      // Optimistically update the individual resource
      if (resourceData) {
        const optimisticResource = {
          ...resourceData,
          title: currentFormData.title,
          price: Number(currentFormData.price),
          discountPrice: Number(currentFormData.discountPrice),
          quantity: Number(currentFormData.quantity),
          format: currentFormData.format,
          country: currentFormData.country,
          states: currentFormData.states,
          divisions: currentFormData.divisions, // Include divisions
          description: currentFormData.description,
        };
        queryClient.setQueryData(["resource", slug], optimisticResource);
      }

      // Return context for rollback
      return { previousResource, previousResourcesList };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousResource) {
        queryClient.setQueryData(["resource", slug], context.previousResource);
      }
      if (context?.previousResourcesList) {
        queryClient.setQueryData(
          ["resources", "approved"],
          context.previousResourcesList
        );
      }

      console.error("Error updating resource:", err);
      toast({
        title: "Error",
        description:
          err.message || "Failed to update resource. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      console.log("Resource updated successfully:", data);

      // Invalidate all related queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ["resource", slug] });
      queryClient.invalidateQueries({ queryKey: ["resources", "approved"] });
      queryClient.invalidateQueries({ queryKey: ["resources"] });

      // Refetch the list immediately to ensure it's updated
      queryClient.refetchQueries({ queryKey: ["resources", "approved"] });

      toast({
        title: "Success!",
        description: "Resource has been updated successfully.",
        variant: "default",
      });
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: ["resource", slug] });
      queryClient.invalidateQueries({ queryKey: ["resources", "approved"] });
    },
  });

  // Optimized input change handler
  const handleInputChange = useCallback(
    (field: keyof FormDataState, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleCountrySelect = useCallback((country: Country) => {
    setSelectedCountry(country);
    setSelectedStates([]);
    setSelectedDivisions([]); // Reset divisions when country changes
    setFormData((prev) => ({
      ...prev,
      country: country.countryName,
      states: [],
      divisions: [], // Reset divisions
    }));
    setCountryOpen(false);
  }, []);

  const handleStateToggle = useCallback(
    (stateName: string) => {
      const newStates = selectedStates.includes(stateName)
        ? selectedStates.filter((s) => s !== stateName)
        : [...selectedStates, stateName];
      setSelectedStates(newStates);
      setSelectedDivisions([]); // Reset divisions when states change
      setFormData((prev) => ({
        ...prev,
        states: newStates,
        divisions: [], // Reset divisions
      }));
    },
    [selectedStates]
  );

  const handleDivisionToggle = useCallback(
    (divisionName: string) => {
      const newDivisions = selectedDivisions.includes(divisionName)
        ? selectedDivisions.filter((d) => d !== divisionName)
        : [...selectedDivisions, divisionName];
      setSelectedDivisions(newDivisions);
      setFormData((prev) => ({ ...prev, divisions: newDivisions }));
    },
    [selectedDivisions]
  );

  const handleThumbnailUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] || null;

      if (thumbnailPreview) {
        URL.revokeObjectURL(thumbnailPreview);
      }

      if (file) {
        if (!file.type.startsWith("image/")) {
          toast({
            title: "Invalid file type",
            description: "Please upload only image files for thumbnail.",
            variant: "destructive",
          });
          setFormData((prev) => ({ ...prev, thumbnail: null }));
          setThumbnailPreview(null);
          if (thumbnailInputRef.current) {
            thumbnailInputRef.current.value = "";
          }
          return;
        }
        setFormData((prev) => ({ ...prev, thumbnail: file }));
        setThumbnailPreview(URL.createObjectURL(file));
      } else {
        setFormData((prev) => ({ ...prev, thumbnail: null }));
        setThumbnailPreview(null);
        if (thumbnailInputRef.current) {
          thumbnailInputRef.current.value = "";
        }
      }
    },
    [thumbnailPreview, toast]
  );

  const handleRemoveThumbnail = useCallback(() => {
    if (thumbnailPreview) {
      URL.revokeObjectURL(thumbnailPreview);
    }
    setThumbnailPreview(null);
    setFormData((prev) => ({ ...prev, thumbnail: null }));
    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.value = "";
    }
  }, [thumbnailPreview]);

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const uploadedFile = event.target.files?.[0] || null;
      setFormData((prev) => ({
        ...prev,
        file: uploadedFile,
      }));
    },
    []
  );

  const handleImagesUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files) {
        const newFiles = Array.from(files);
        const imageFiles = newFiles.filter((file) =>
          file.type.startsWith("image/")
        );

        if (imageFiles.length !== newFiles.length) {
          toast({
            title: "Invalid file type",
            description: "Some files were not images and were not added.",
            variant: "destructive",
          });
        }

        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...imageFiles],
        }));
        setImagePreviews((prev) => [
          ...prev,
          ...imageFiles.map((file) => URL.createObjectURL(file)),
        ]);
      }
      if (event.target) {
        event.target.value = "";
      }
    },
    [toast]
  );

  const handleRemoveImage = useCallback(
    (indexToRemove: number) => {
      URL.revokeObjectURL(imagePreviews[indexToRemove]);
      setImagePreviews((prev) =>
        prev.filter((_, index) => index !== indexToRemove)
      );
      setFormData((prev) => ({
        ...prev,
        images: prev.images.filter((_, index) => index !== indexToRemove),
      }));
    },
    [imagePreviews]
  );

  const handleRemoveExistingImage = useCallback((indexToRemove: number) => {
    setExistingImages((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  }, []);

  const handleSubmit = useCallback(
    (action: "publish" | "draft") => {
      const formDataToSubmit: FormDataState = {
        ...formData,
        productStatus: action === "publish" ? "approved" : "draft",
      };

      updateResource(formDataToSubmit);
    },
    [updateResource, formData]
  );

  // Memoize filtered states and divisions
  const filteredStates = useMemo(
    () =>
      selectedCountry?.states.filter((state) =>
        state.stateName.toLowerCase().includes(stateSearch.toLowerCase())
      ) || [],
    [selectedCountry?.states, stateSearch]
  );

  const filteredDivisions = useMemo(
    () =>
      selectedCountry?.states
        .filter((state) => selectedStates.includes(state.stateName))
        .flatMap((state) => state.divisions)
        .filter((division) =>
          division.divisionName.toLowerCase().includes(divisionSearch.toLowerCase())
        ) || [],
    [selectedCountry?.states, selectedStates, divisionSearch]
  );

  useEffect(() => {
    return () => {
      if (thumbnailPreview) {
        URL.revokeObjectURL(thumbnailPreview);
      }
      imagePreviews.forEach((previewUrl) => URL.revokeObjectURL(previewUrl));
    };
  }, [thumbnailPreview, imagePreviews]);

  if (isLoadingResource) {
    return (
      <div className="max-w-9xl mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading resource data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (resourceError) {
    return (
      <div className="max-w-9xl mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">
              Error Loading Resource
            </h2>
            <p className="text-gray-600">
              Failed to load resource data. Please try again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mt-6 px-6">
        <PageHeader title="Resource List Edit" />
        <p className="text-gray-500 -mt-4">Dashboard &gt; Resource List</p>
      </div>
      <div className="max-w-9xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Section */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Edit Resource
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-base">
                    Title
                  </Label>
                  <Input
                    id="title"
                    className="h-[49px] border border-gray-500"
                    placeholder="Add your title..."
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-base font-semibold">
                      Price
                    </Label>
                    <Input
                      className="h-[49px] border border-gray-500"
                      id="price"
                      placeholder="Add price.."
                      value={formData.price}
                      onChange={(e) =>
                        handleInputChange("price", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      className="text-base font-semibold"
                      htmlFor="discountPrice"
                    >
                      Discount Price
                    </Label>
                    <Input
                      id="discountPrice"
                      className="h-[49px] border border-gray-500"
                      placeholder="Add Discount Price.."
                      value={formData.discountPrice}
                      onChange={(e) =>
                        handleInputChange("discountPrice", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      className="text-base font-semibold"
                      htmlFor="quantity"
                    >
                      Quantity
                    </Label>
                    <Input
                      id="quantity"
                      className="h-[49px] border border-gray-500"
                      placeholder="Add Quantity.."
                      value={formData.quantity}
                      onChange={(e) =>
                        handleInputChange("quantity", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-base font-semibold" htmlFor="format">
                      Format
                    </Label>
                    <Select
                      value={formData.format}
                      onValueChange={(value) =>
                        handleInputChange("format", value)
                      }
                    >
                      <SelectTrigger className="h-[49px] border border-gray-500">
                        <SelectValue placeholder="Add format.." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PDF">PDF</SelectItem>
                        <SelectItem value="Document">Doc</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Country</Label>
                    <Popover open={countryOpen} onOpenChange={setCountryOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={countryOpen}
                          className="w-full justify-between h-[49px] border"
                          disabled={isLoadingCountries}
                        >
                          {selectedCountry
                            ? selectedCountry.countryName
                            : "Select country..."}
                          <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search country..." />
                          <CommandList>
                            <CommandEmpty>No country found.</CommandEmpty>
                            <CommandGroup>
                              {countriesData?.map((country: Country) => (
                                <CommandItem
                                  key={country._id}
                                  value={country.countryName}
                                  onSelect={() => handleCountrySelect(country)}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedCountry?._id === country._id
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {country.countryName}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label>States</Label>
                    <Popover open={stateOpen} onOpenChange={setStateOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={stateOpen}
                          className="w-full justify-between h-[49px] border"
                          disabled={!selectedCountry}
                        >
                          {selectedStates.length > 0
                            ? `${selectedStates.length} state(s) selected`
                            : "Select states..."}
                          <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput
                            placeholder="Search states..."
                            value={stateSearch}
                            onValueChange={setStateSearch}
                          />
                          <CommandList>
                            <CommandEmpty>No state found.</CommandEmpty>
                            <CommandGroup>
                              {filteredStates.map((state) => (
                                <CommandItem
                                  key={state.stateName}
                                  value={state.stateName}
                                  onSelect={() => handleStateToggle(state.stateName)}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedStates.includes(state.stateName)
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {state.stateName}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label>Divisions</Label>
                    <Popover open={divisionOpen} onOpenChange={setDivisionOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={divisionOpen}
                          className="w-full justify-between h-[49px] border"
                          disabled={selectedStates.length === 0}
                        >
                          {selectedDivisions.length > 0
                            ? `${selectedDivisions.length} division(s) selected`
                            : "Select divisions..."}
                          <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput
                            placeholder="Search divisions..."
                            value={divisionSearch}
                            onValueChange={setDivisionSearch}
                          />
                          <CommandList>
                            <CommandEmpty>No division found.</CommandEmpty>
                            <CommandGroup>
                              {filteredDivisions.map((division) => (
                                <CommandItem
                                  key={division.divisionName}
                                  value={division.divisionName}
                                  onSelect={() =>
                                    handleDivisionToggle(division.divisionName)
                                  }
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedDivisions.includes(
                                        division.divisionName
                                      )
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {division.divisionName}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <div className="rounded-md border border-gray-300 h-[300px] overflow-hidden">
                    {typeof window !== "undefined" && (
                      <ReactQuill
                        theme="snow"
                        value={formData.description}
                        onChange={(content) =>
                          handleInputChange("description", content)
                        }
                        modules={modules}
                        formats={formats}
                        className="h-[300px] rounded-md"
                        style={{ height: "300px" }}
                      />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Practice Area & Resource Type */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <Label className="text-base font-semibold">
                    Practice Area
                  </Label>
                  <Select
                    value={formData.practiceArea}
                    onValueChange={(value) => {
                      handleInputChange("practiceArea", value);
                      const selectedArea = practiceAreasData?.find(
                        (area) => area._id === value
                      );
                      setPracticeArea(selectedArea ? selectedArea.name : value);
                    }}
                  >
                    <SelectTrigger className="h-[49px] border border-gray-400">
                      <SelectValue placeholder="Select a practice area" />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingPracticeAreas ? (
                        <SelectItem value="loading" disabled>
                          Loading...
                        </SelectItem>
                      ) : (
                        practiceAreasData?.map((area: PracticeArea) => (
                          <SelectItem key={area._id} value={area._id}>
                            {area.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  {singelPracticeArea?.subPracticeAreas?.map(
                    (subArea: { _id: string; name: string }) => (
                      <div
                        key={subArea._id}
                        className="flex items-center space-x-2 mt-2"
                      >
                        <Checkbox
                          id={subArea.name}
                          checked={selectedSubAreas.includes(subArea.name)}
                          onCheckedChange={(checked: boolean | "indeterminate") =>
                            handleCheckboxChange(subArea.name, Boolean(checked))
                          }
                        />
                        <Label
                          htmlFor={subArea.name}
                          className="text-sm font-medium"
                        >
                          {subArea.name}
                        </Label>
                      </div>
                    )
                  )}
                </div>

                <div className="space-y-2 mt-4">
                  <Label className="text-base font-semibold">
                    Resource Type
                  </Label>
                  <Select
                    value={formData.resourceType}
                    onValueChange={(value) =>
                      handleInputChange("resourceType", value)
                    }
                  >
                    <SelectTrigger className="h-[49px] border border-gray-400">
                      <SelectValue placeholder="Select a resource type" />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingResourceTypes ? (
                        <SelectItem value="loading" disabled>
                          Loading...
                        </SelectItem>
                      ) : (
                        resourceTypesData?.map((type: ResourceType) => (
                          <SelectItem key={type._id} value={type._id}>
                            {type.resourceTypeName}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Thumbnail */}
            <Card>
              <CardHeader>
                <CardTitle>Thumbnail</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <Label htmlFor="thumbnail-upload">
                    Thumbnail (Images Only)
                  </Label>

                  {/* Show existing thumbnail */}
                  {existingThumbnail && !thumbnailPreview && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">
                        Current thumbnail:
                      </p>
                      <div className="relative">
                        <Image
                          width={200}
                          height={150}
                          src={existingThumbnail || "/placeholder.svg"}
                          alt="Current thumbnail"
                          className="max-h-40 w-auto rounded-md object-contain"
                        />
                      </div>
                    </div>
                  )}

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      className="hidden"
                      id="thumbnail-upload"
                      ref={thumbnailInputRef}
                    />
                    {formData.thumbnail && thumbnailPreview ? (
                      <div className="space-y-3">
                        <Image
                          width={100}
                          height={100}
                          src={thumbnailPreview || "/placeholder.svg"}
                          alt="New thumbnail preview"
                          className="max-h-40 w-auto mx-auto rounded-md object-contain"
                        />
                        <p
                          className="text-sm text-gray-600 truncate"
                          title={formData.thumbnail.name}
                        >
                          {formData.thumbnail.name}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleRemoveThumbnail}
                          className="w-full text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                          <X className="mr-2 h-4 w-4" /> Remove New Image
                        </Button>
                      </div>
                    ) : (
                      <label
                        htmlFor="thumbnail-upload"
                        className="cursor-pointer flex flex-col items-center justify-center space-y-2 py-4"
                      >
                        <ImageIcon className="h-12 w-12 text-gray-400" />
                        <p className="text-sm text-gray-600">
                          {existingThumbnail
                            ? "Click to replace thumbnail"
                            : "Click or drag to upload"}
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </label>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* File Upload */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <Label>File (PDF, Word, etc.)</Label>

                  {/* Show existing file */}
                  {existingFile && !formData.file && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-md">
                      <p className="text-sm text-gray-600 mb-1">
                        Current file:
                      </p>
                      <a
                        href={existingFile.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm underline"
                      >
                        View current file ({existingFile.type})
                      </a>
                    </div>
                  )}

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <FileText className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">
                        {formData.file
                          ? formData.file.name
                          : existingFile
                          ? "Click to replace file"
                          : "Click to upload file"}
                      </p>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Multiple Images Upload */}
            <Card>
              <CardHeader>
                <CardTitle>Images</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <Label htmlFor="images-upload">Additional Images</Label>

                  {/* Show existing images */}
                  {existingImages.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">
                        Current images:
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {existingImages.map((imageUrl, index) => (
                          <div key={index} className="relative group">
                            <Image
                              src={imageUrl || "/placeholder.svg"}
                              alt={`Existing image ${index + 1}`}
                              width={100}
                              height={100}
                              className="w-full h-24 object-cover rounded-md"
                            />
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleRemoveExistingImage(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImagesUpload}
                      className="hidden"
                      id="images-upload"
                    />
                    <label
                      htmlFor="images-upload"
                      className="cursor-pointer flex flex-col items-center justify-center space-y-2 py-4"
                    >
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                      <p className="text-sm text-gray-600">
                        Click or drag to upload new images
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 5MB each
                      </p>
                    </label>
                  </div>

                  {/* Show new images to be uploaded */}
                  {imagePreviews.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2">
                        New images to upload:
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {imagePreviews.map((previewUrl, index) => (
                          <div key={index} className="relative group">
                            <Image
                              src={previewUrl || "/placeholder.svg"}
                              alt={`New preview ${index + 1}`}
                              width={100}
                              height={100}
                              className="w-full h-24 object-cover rounded-md"
                            />
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleRemoveImage(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <p
                              className="text-xs text-gray-500 truncate mt-1"
                              title={formData.images[index]?.name}
                            >
                              {formData.images[index]?.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Button className="w-full" onClick={() => setPreviewOpen(true)}>
              Preview
            </Button>
            {/* Submit Button */}
            <div className="flex gap-4 items-center justify-center">
              <Button
                onClick={() => handleSubmit("publish")}
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Publishing..." : "Publish Resources"}
              </Button>
              <Button
                onClick={() => handleSubmit("draft")}
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Drafting..." : "Draft"}
              </Button>
            </div>
          </div>
        </div>

        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Preview Data</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <p>
                <strong>Title:</strong> {formData.title}
              </p>
              <p>
                <strong>Price:</strong> {formData.price}
              </p>
              <p>
                <strong>Discount Price:</strong> {formData.discountPrice}
              </p>
              <p>
                <strong>Quantity:</strong> {formData.quantity}
              </p>
              <p>
                <strong>Format:</strong> {formData.format}
              </p>
              <p>
                <strong>Country:</strong> {formData.country}
              </p>
              <p>
                <strong>States:</strong> {formData.states.join(", ")}
              </p>
              <p>
                <strong>Divisions:</strong> {formData.divisions.join(", ")}
              </p>
              <p>
                <strong>Product Status:</strong> {formData.productStatus}
              </p>
              <p>
                <strong>Description:</strong> {formData.description}
              </p>
              <p>
                <strong>Practice Area:</strong> {practiceArea}
              </p>
              {/* Thumbnail Preview */}
              {formData.thumbnail && (
                <div>
                  <strong>Thumbnail:</strong>
                  <Image
                    width={100}
                    height={100}
                    src={URL.createObjectURL(formData.thumbnail)}
                    alt="Thumbnail Preview"
                    className="w-32 h-32 object-cover border"
                  />
                </div>
              )}
              {/* Existing Thumbnail */}
              {existingThumbnail && !formData.thumbnail && (
                <div>
                  <strong>Current Thumbnail:</strong>
                  <Image
                    width={100}
                    height={100}
                    src={existingThumbnail}
                    alt="Current Thumbnail"
                    className="w-32 h-32 object-cover border"
                  />
                </div>
              )}
              {/* File Name */}
              {formData.file && (
                <p>
                  <strong>File:</strong> {formData.file.name}
                </p>
              )}
              {/* Existing File */}
              {existingFile && !formData.file && (
                <p>
                  <strong>Current File:</strong>{" "}
                  <a
                    href={existingFile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {existingFile.type}
                  </a>
                </p>
              )}
              {/* Images Preview */}
              {formData.images.length > 0 && (
                <div>
                  <strong>New Images:</strong>
                  <div className="flex gap-2 flex-wrap">
                    {formData.images.map((img, idx) => (
                      <Image
                        width={100}
                        height={100}
                        key={idx}
                        src={URL.createObjectURL(img)}
                        alt={`Image ${idx + 1}`}
                        className="w-24 h-24 object-cover border"
                      />
                    ))}
                  </div>
                </div>
              )}
              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div>
                  <strong>Current Images:</strong>
                  <div className="flex gap-2 flex-wrap">
                    {existingImages.map((img, idx) => (
                      <Image
                        width={100}
                        height={100}
                        key={idx}
                        src={img}
                        alt={`Existing Image ${idx + 1}`}
                        className="w-24 h-24 object-cover border"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}