"use client"

import { useRouter } from "next/navigation"
// import { Breadcrumb } from "@/components/breadcrumb"
import { ChevronRight } from "lucide-react"

export default function SettingPage() {
  const router = useRouter()

  const settingsOptions = [
    {
      title: "Personal Information",
      onClick: () => router.push("/setting/personal-information"),
    },
    {
      title: "Change Password",
      onClick: () => router.push("/setting/change-password"),
    },
     {
      title: "Terms & Conditions",
      onClick: () => router.push("/setting/tmc"),
    },
  ]

  return (
    <div className="flex h-screen bg-[#EDEEF1]">

      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* <Breadcrumb items={[{ label: "Dashboard", href: "/" }, { label: "Setting" }]} /> */}

          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Setting</h1>
            <p className="text-gray-500">Dashboard &gt; Setting</p>
          </div>

          <div className="space-y-4">
            {settingsOptions.map((option, index) => (
              <div
                key={index}
                onClick={option.onClick}
                className="border border-[#707070] rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors "
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-900 font-medium">{option.title}</span>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
