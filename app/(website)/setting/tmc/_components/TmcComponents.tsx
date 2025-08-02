// "use client";

// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import axios from "axios";
// import { EditorContent, useEditor } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";
// import { Button } from "@/components/ui/button"; // Adjust to your project

// const formSchema = z.object({
//   terms: z.string().min(1, "Terms & Conditions is required"),
// });

// type FormValues = z.infer<typeof formSchema>;

// export default function TermsAndConditions() {
//   const queryClient = useQueryClient();

//   // React Hook Form Setup
//   const {
//     handleSubmit,
//     setValue,
//     watch,
//     formState: { errors },
//   } = useForm<FormValues>({
//     resolver: zodResolver(formSchema),
//     defaultValues: { terms: "" },
//   });

//   const terms = watch("terms");

//   // Tiptap Editor Setup
//   const editor = useEditor({
//     extensions: [StarterKit],
//     content: "",
//     onUpdate: ({ editor }) => {
//       setValue("terms", editor.getHTML());
//     },
//   });

//   // Fetch existing data (if any)
//   const { data: existingData, isLoading } = useQuery({
//     queryKey: ["terms"],
//     queryFn: async () => {
//       const res = await axios.get("/api/terms");
//       return res.data;
//     },
//     onSuccess: (data) => {
//       setValue("terms", data.terms);
//       editor?.commands.setContent(data.terms);
//     },
//     refetchOnWindowFocus: false,
//   });

//   // Create or Update Terms
//   const mutation = useMutation({
//     mutationFn: async (data: FormValues) => {
//       if (existingData && existingData.id) {
//         return axios.put(`/api/terms/${existingData.id}`, data);
//       } else {
//         return axios.post("/api/terms", data);
//       }
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["terms"] });
//       alert("Terms & Conditions saved successfully");
//     },
//     onError: () => {
//       alert("Failed to save Terms & Conditions");
//     },
//   });

//   const onSubmit = (data: FormValues) => {
//     mutation.mutate(data);
//   };

//   return (
//     <div className="max-w-3xl mx-auto mt-10 p-4 border rounded-md">
//       <h1 className="text-2xl font-bold mb-4">Terms & Conditions</h1>

//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//         <div>
//           <label className="font-medium">Rich Text Editor</label>
//           <div className="border mt-2 rounded min-h-[200px] p-2">
//             <EditorContent editor={editor} />
//           </div>
//           {errors.terms && (
//             <p className="text-sm text-red-500">{errors.terms.message}</p>
//           )}
//         </div>

//         <Button type="submit" disabled={mutation.isPending}>
//           {existingData ? "Update Terms" : "Create Terms"}
//         </Button>
//       </form>
//     </div>
//   );
// }
