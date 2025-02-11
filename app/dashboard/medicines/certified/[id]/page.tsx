"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowLeft, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import PencilIcon from "@/components/ui/pencilIcon";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import SortIcon from "@/components/ui/SortIcon";
import FilterIcon from "@/components/ui/FilterIcon";
import StarIcon from "@/components/ui/StarIcon";
import Pharmacist from "@/components/ui/Pharmacist";
import ClockIcon from "@/components/ui/ClockIcon";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getMedicineByName } from "@/store/slices/medicineSlice";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import { getPublicS3Url } from "@/utils/s3Utils";
import { ImagePreviewModal } from "@/components/image-preview-modal";

const remarks = [
  {
    id: 1,
    pharmacistId: "123456789",
    text: "The purchase of this medication will not proceed due to its similarity to the external packaging of the following item.",
    timestamp: "12/12/24, 09:34",
    isStarred: true,
  },
  {
    id: 2,
    pharmacistId: "987654321",
    text: "Similar packaging design might cause confusion.",
    timestamp: "12/12/24, 10:15",
    isStarred: false,
  },
  {
    id: 3,
    pharmacistId: "456789123",
    text: "Recommend reviewing the packaging design.",
    timestamp: "12/12/24, 11:45",
    isStarred: false,
  },
];

export default function CertifiedMedicineDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { error, currentMedicine, loading } = useAppSelector(
    (state) => state.medicine
  );
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("medication");
  const [showAllImages, setShowAllImages] = useState(false);
  const [starredOnly, setStarredOnly] = useState(false);
  const [sortOrder, setSortOrder] = useState<"new" | "old">("new");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    dispatch(getMedicineByName(params.id));
  }, [dispatch, params.id]);

  const data = currentMedicine?.at(0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-red-500">{error}</p>
        <Button onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Medicines
        </Button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p>Medicine not found</p>
        <Button onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Medicines
        </Button>
      </div>
    );
  }

  const filteredRemarks = remarks
    .filter((remark) => !starredOnly || remark.isStarred)
    .sort((a, b) => {
      if (sortOrder === "new") {
        return (
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      }
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    });

  return (
    <div className="min-h-screen bg-color-gray-200 p-2 sm:p-6">
      <div className="flex flex-col gap-6  overflow-y-auto bg-white border-[1px] border-color-gray-250 rounded-[8px]">
        <div className="p-2 sm:p-6 min-h-[calc(100vh-3rem)]">
          <div className="">
            <Button
              variant="link"
              className="p-0 h-auto text-logoblue hover:underline"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" color="#0165FC" />
              Back
            </Button>
          </div>
          {/* Image Grid */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-6 pt-2 justify-center sm:justify-start">
              {(showAllImages
                ? data.images_location
                : data.images_location.slice(0, 8)
              ).map((image, index) => (
                <div
                  key={index}
                  className="w-32 h-32 flex-shrink-0 relative overflow-hidden rounded-[8px] cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setSelectedImage(image)}
                >
                  <Image
                    src={getPublicS3Url(image)}
                    alt={`Medicine ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
            {data.images_location.length > 8 && (
              <Button
                variant="link"
                className="text-logoblue"
                onClick={() => setShowAllImages(!showAllImages)}
              >
                {showAllImages ? "Show Less" : "Show More"}
              </Button>
            )}
          </div>

          {/* Image Preview Modal */}
          <ImagePreviewModal
            isOpen={!!selectedImage}
            onClose={() => setSelectedImage(null)}
            imageUrl={selectedImage ? getPublicS3Url(selectedImage) : ""}
          />

          {/* Title and Actions */}

          <div className="flex items-center justify-between mb-8 flex-wrap sm:flex-nowrap">
            <div className="flex flex-col items-start gap-1">
              <Badge
                variant="outline"
                className="bg-[#cff7d3] text-[#14ae5c] border-[#cff7d3] whitespace-nowrap py-2"
              >
                {data.status}
              </Badge>
              <h1 className="text-2xl font-semibold text-nowrap mr-2">
                {data.product_name}
              </h1>
            </div>
            <Button
              variant="outline"
              className="flex justify-center items-center w-full sm:w-[8rem] gap-3 bg-logoblue text-white rounded-[8px] mt-2 sm:mt-0 hover:bg-blue-700 hover:text-white"
            >
              <PencilIcon />
              Edit
            </Button>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="border-b-0 border-gray-200 border-0 h-fit rounded-none">
              <TabsTrigger value="medication" className="border-0 p-0">
                <div
                  className={`px-1 sm:px-4 py-2 relative border-t-[1px] ${
                    activeTab === "medication" && "bg-color-gray-200"
                  }`}
                >
                  <span
                    className={`${
                      activeTab === "medication"
                        ? "text-[#0165fc] "
                        : "text-[#757575]"
                    }`}
                  >
                    Medical Information
                  </span>
                  {activeTab === "medication" && (
                    <div className="absolute -bottom-[1px] left-0 right-0 h-[1px] bg-[#0165fc]" />
                  )}
                </div>
              </TabsTrigger>
              <TabsTrigger value="lasa" className="border-0 p-0">
                <div
                  className={`px-1 sm:px-4 py-2 relative border-t-[1px] ${
                    activeTab === "lasa" && "bg-color-gray-200"
                  }`}
                >
                  <span
                    className={`${
                      activeTab === "lasa"
                        ? "text-[#0165fc] "
                        : "text-[#757575]"
                    }`}
                  >
                    LASA Remarks
                  </span>
                  {activeTab === "lasa" && (
                    <div className="absolute -bottom-[1px] left-0 right-0 h-[1px] bg-[#0165fc]" />
                  )}
                </div>
              </TabsTrigger>
              <TabsTrigger value="status" className="border-0 p-0">
                <div
                  className={`px-1 sm:px-4 py-2 relative border-t-[1px] ${
                    activeTab === "status" && "bg-color-gray-200"
                  }`}
                >
                  <span
                    className={`${
                      activeTab === "status"
                        ? "text-[#0165fc] "
                        : "text-[#757575]"
                    }`}
                  >
                    Status
                  </span>
                  {activeTab === "status" && (
                    <div className="absolute -bottom-[1px] left-0 right-0 h-[1px] bg-[#0165fc]" />
                  )}
                </div>
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="medication"
              className="space-y-6 border-t-[1px] mt-0 "
            >
              <div className="w-full xl:w-1/2 grid md:grid-cols-2 gap-8 mt-3">
                <div className="space-y-4">
                  <h2 className="font-semibold">Basic Product Information</h2>
                  <div>
                    <label className="block text-sm mb-1">Product Name</label>
                    <Input
                      value={data.product_name || ""}
                      readOnly
                      className="rounded-[8px] mt-1 border-color-gray-250"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Category</label>
                    <Input
                      value={data.category || ""}
                      readOnly
                      className="rounded-[8px] mt-1 border-color-gray-250"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Intake Method</label>
                    <Input
                      value={data.intake_method || ""}
                      readOnly
                      className="rounded-[8px] mt-1 border-color-gray-250"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">
                      Manufactured country
                    </label>
                    <Input
                      value={data.manufacturing_country || ""}
                      readOnly
                      className="rounded-[8px] mt-1 border-color-gray-250"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">
                      Country of registration
                    </label>
                    <Input
                      value={data.country_registration || ""}
                      readOnly
                      className="rounded-[8px] mt-1 border-color-gray-250"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="font-semibold">Identification Data</h2>
                  <div>
                    <label className="block text-sm mb-1">
                      Catalog Number / Barcode
                    </label>
                    <Input
                      value={data.barcode || ""}
                      readOnly
                      className="rounded-[8px] mt-1 border-color-gray-250"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">ID</label>
                    <Input
                      value={data.metadata_id || ""}
                      readOnly
                      className="rounded-[8px] mt-1 border-color-gray-250"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Manufacturer</label>
                    <Input
                      value={data.manufacturer || ""}
                      readOnly
                      className="rounded-[8px] mt-1 border-color-gray-250"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">
                      Type of packaging
                    </label>
                    <Input
                      value={data.type_packaging || ""}
                      readOnly
                      className="rounded-[8px] mt-1 border-color-gray-250"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="lasa" className="border-t-[1px] mt-0">
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-sm text-gray-600">
                    All remarks: {filteredRemarks.length}
                  </div>
                  <div className="flex items-center gap-5">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button className="px-4 text-lg rounded-[8px] hover:bg-color-gray-200">
                          <FilterIcon />
                          <span className="text-logoblue">Filter</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-40" align="end">
                        <div className="grid gap-1">
                          <Button
                            variant="ghost"
                            className={`justify-start font-normal py-3 rounded-[8px] hover:bg-color-gray-200 hover:text-logoblue`}
                            onClick={() => setStarredOnly(!starredOnly)}
                          >
                            {starredOnly ? "Show All" : "Show Starred"}
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button className="px-4 text-lg rounded-[8px] hover:bg-color-gray-200">
                          <SortIcon />
                          <span className="text-logoblue">Sort</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-40" align="end">
                        <div className="grid gap-1">
                          <Button
                            variant="ghost"
                            onClick={() => setSortOrder("new")}
                            className={`justify-start font-normal py-3 rounded-[8px] hover:bg-color-gray-200 ${
                              sortOrder === "new"
                                ? "text-logoblue bg-color-gray-200"
                                : "hover:text-logoblue"
                            }`}
                          >
                            First New
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => setSortOrder("old")}
                            className={`justify-start font-normal py-3 rounded-[8px] hover:bg-color-gray-200 ${
                              sortOrder === "old"
                                ? "text-logoblue bg-color-gray-200"
                                : "hover:text-logoblue"
                            }`}
                          >
                            First Old
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredRemarks.map((remark) => (
                    <div
                      key={remark.id}
                      className="rounded-[8px] border border-[#e5e5e5] p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Pharmacist />
                          <span className="font-medium">
                            Pharmacist (ID {remark.pharmacistId})
                          </span>
                        </div>
                        <StarIcon isFilled={remark.isStarred} />
                      </div>
                      <p className="mt-2 text-gray-600">{remark.text}</p>
                      <div className="flex gap-1 mt-2 text-sm">
                        <ClockIcon />
                        <span>{remark.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="status" className="border-t-[1px] mt-0">
              <div className="w-full xl:w-1/2 grid md:grid-cols-2 gap-8 mt-3">
                <div>
                  <div className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-sm">
                        Submitter type
                      </label>
                      <Input
                        value="Pharmacy"
                        readOnly
                        className="rounded-[8px] mt-1 border-color-gray-250"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm">
                        Submission date
                      </label>
                      <Input
                        value="20/12/24"
                        readOnly
                        className="rounded-[8px] mt-1 border-color-gray-250"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <div className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-sm">
                        Submitter type ID
                      </label>
                      <Input
                        value="123456789"
                        readOnly
                        className="rounded-[8px] mt-1 border-color-gray-250"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm">Status</label>
                      <Input
                        value={data.status}
                        readOnly
                        className="rounded-[8px] mt-1 border-color-gray-250"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
