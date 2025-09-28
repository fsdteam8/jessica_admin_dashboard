"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import QuillEditor from "@/components/ui/quill-editor";
import { useEffect } from "react";

const FormSchema = z.object({
  heading: z.string().min(1, "Heading is required"),
  phone: z.string().min(1, "Phone Number is required"),
  description: z.string().min(1, "Description is required"),
  email: z.string().email("Invalid email address"),
  location: z.string().min(3, "Location is required"),
  // phone: z
  //   .string()
  //   .trim()
  //   .regex(/^\(\d{3}\)\s\d{3}-\d{4}$/, {
  //     message: "Enter a valid phone number (e.g. (406) 555-0120).",
  //   }),
  businessHour: z.string().min(1, "Business hour is required"),
});

export interface Contact {
  _id: string;
  heading: string;
  description: string;
  email: string;
  phone: string;
  location: string;
  businessHour: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ApiResponse {
  status: boolean;
  message: string;
  data: Contact[];
}

const ContactContainer = () => {
  //   const session = useSession();
  //   const token = session?.data?.accessToken || "";
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      heading: "",
      description: "",
      email: "",
      location: "",
      phone: "",
      businessHour: "",
    },
  });
  //   contact us get api logic
  const { data } = useQuery<ApiResponse>({
    queryKey: ["contact"],
    queryFn: async () =>
      await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/custom/contact`
      ).then((res) => res.json()),
  });
 
  useEffect(() => {
    if (data?.data) {
      form.reset({
        heading: data?.data[0]?.heading || "",
        description: data?.data[0]?.description || "",
        email: data?.data[0]?.email || "",
        location: data?.data[0]?.location || "",
        phone: data?.data[0]?.phone || "",
        businessHour: data?.data[0]?.businessHour || "",
      });
    }
  }, [data, form]);

  // contact us post api logic
  const { mutate, isPending } = useMutation({
    mutationKey: ["contact-us"],
    mutationFn: (data: z.infer<typeof FormSchema>) =>
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/custom/contact`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }

      ).then((res) => res.json()),
    onSuccess: (data) => {
      if (!data?.status) {
        toast.error(data?.message || "Something went wrong");
        return;
      }
      toast.success(data?.message || "Custom contact updated successfully");
      queryClient.invalidateQueries({ queryKey: ["contact"] });
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    mutate(data);
  }

  return (
    <div className="px-[50px] py-10 ">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full bg-white rounded-[8px] shadow-md p-6 flex flex-col gap-6"
        >
          {/* <h3 className="text-4xl font-bold text-[#23547B] leading-normal ">Compose Your Email</h3> */}
          <div className=" ">
            <FormField
              control={form.control}
              name="heading"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-medium font-poppins text-[#23547B] leading-[120%] tracking-[0%] ">
                    Heading
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="w-full h-[40px] border border-[#23547B] rounded-[8px] font-manrope bg-white text-base text-black font-medium leading-normal placeholder:text-[#929292]"
                      placeholder="Enter Your Heading..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>
          {/* heading */}
          <div className="">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-medium font-poppins text-[#23547B] leading-[120%] tracking-[0%] ">
                    Description
                  </FormLabel>
                  <FormControl className="">
                    <QuillEditor
                      id="description"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-medium font-poppins text-[#23547B] leading-[120%] tracking-[0%] ">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="w-full h-[40px] border border-[#23547B] rounded-[8px] font-manrope bg-white text-base text-black font-medium leading-normal placeholder:text-[#929292]"
                      placeholder="Enter Your Email..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-medium font-poppins text-[#23547B] leading-[120%] tracking-[0%] ">
                    Phone Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="w-full h-[40px] border border-[#23547B] rounded-[8px] font-manrope bg-white text-base text-black font-medium leading-normal placeholder:text-[#929292]"
                      placeholder="Enter Your Phone Number..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-medium font-poppins text-[#23547B] leading-[120%] tracking-[0%] ">
                    Location
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="w-full h-[40px] border border-[#23547B] rounded-[8px] font-manrope bg-white text-base text-black font-medium leading-normal placeholder:text-[#929292]"
                      placeholder="Enter Your Location..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="businessHour"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-medium font-poppins text-[#23547B] leading-[120%] tracking-[0%] ">
                    Business Hour
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="w-full h-[40px] border border-[#23547B] rounded-[8px] font-manrope bg-white text-base text-black font-medium leading-normal placeholder:text-[#929292]"
                      placeholder="Enter Your Business Hour..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full flex items-center justify-center">
            <button
              disabled={isPending}
              className="w-[127px] h-[40px] bg-[#23547B] text-[#F2F2F2] rounded-[8px] text-base font-bold font-manrope leading-normal "
              type="submit"
            >
              {isPending ? "Sending..." : "Submit"}
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ContactContainer;
