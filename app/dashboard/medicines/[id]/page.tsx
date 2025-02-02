"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DeclineModal } from "@/components/decline-modal";
import { ApproveModal } from "@/components/approve-modal";
import FilterIcon from "@/components/FilterIcon";
import SortIcon from "@/components/SortIcon";
import StarIcon from "@/components/StarIcon";
import placeholder from "@/assets/image-placeholder.jpg";
import PencilIcon from "@/components/ui/pencilIcon";
import DeclineIcon from "@/components/DeclineIcon";
import CheckIconSmall from "@/components/CheckIconSmall";
import MarkExcl from "@/components/MarkExcl";
import A from "@/components/A";
import Drop from "@/components/Drop";
import Pills from "@/components/Pills";
import Pharmacist from "@/components/Pharmacist";
import ClockIcon from "@/components/ClockIcon";

// Mock data - would come from API in real app
const initialMedicineData = {
  id: "123456789",
  name: "Cefotaxime Medo",
  status: "Pending" as "Pending" | "Decline",
  category: "Ampoules",
  intakeMethod: "IM;IV",
  catalogNumber: "7290015842006",
  logistic: "135A678",
  manufacturedCountry: "Cyprus",
  registrationCountry: "Israel",
  quantity: "-",
  images: Array(9).fill({ url: placeholder }),
};

const similarityData = [
  {
    name: "Cefotaxime Medo",
    totalSimilarity: 99,
    visualSimilarity: 99,
    textSimilarity: 99,
    boxSimilarity: 88,
    images: Array(8).fill({ url: placeholder }),
  },
  {
    name: "Cefotaxime Medok",
    totalSimilarity: 88,
    visualSimilarity: 99,
    textSimilarity: 88,
    boxSimilarity: 88,
    images: Array(8).fill({ url: placeholder }),
  },
];

// Mock data for remarks
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

// export async function generateStaticParams() {
//   const medicine = [
//     {
//       id: "1",
//       name: "Cefotaxime Medo",
//       date: "20/10/24",
//       groupType: "Pharmacy",
//       status: "Pending",
//     },
//     {
//       id: "2",
//       name: "Ibuprofen",
//       date: "20/10/24",
//       groupType: "Technical",
//       status: "Pending",
//     },
//     {
//       id: "3",
//       name: "Paracetamol",
//       date: "20/10/24",
//       groupType: "Technical",
//       status: "Pending",
//     },
//     {
//       id: "4",
//       name: "Metformin",
//       date: "19/10/24",
//       groupType: "Pharmacy",
//       status: "Pending",
//     },
//     {
//       id: "5",
//       name: "Omeprazole",
//       date: "18/10/24",
//       groupType: "Pharmacy",
//       status: "Pending",
//     },
//     {
//       id: "6",
//       name: "Doxycycline",
//       date: "17/10/24",
//       groupType: "Technical",
//       status: "Pending",
//     },
//     {
//       id: "7",
//       name: "Amoxicillin",
//       date: "20/10/24",
//       groupType: "Pharmacy",
//       status: "Pending",
//     },
//     {
//       id: "8",
//       name: "Aspirin",
//       date: "20/10/24",
//       groupType: "Technical",
//       status: "Pending",
//     },
//     {
//       id: "9",
//       name: "Lisinopril",
//       date: "19/10/24",
//       groupType: "Pharmacy",
//       status: "Pending",
//     },
//     {
//       id: "10",
//       name: "Simvastatin",
//       date: "19/10/24",
//       groupType: "Technical",
//       status: "Pending",
//     },
//   ];
//   const ids = medicine.map((item) => ({
//     params: { id: item.id },
//   }));
//   console.log(ids);
//   return ids;
// }

function SimilarityCard({
  name,
  totalSimilarity,
  visualSimilarity,
  textSimilarity,
  boxSimilarity,
  images,
  isExpanded,
  onToggleExpand,
}: {
  name: string;
  totalSimilarity: number;
  visualSimilarity: number;
  textSimilarity: number;
  boxSimilarity: number;
  images: { url: string }[];
  isExpanded: boolean;
  onToggleExpand: () => void;
}) {
  return (
    <div className="rounded-lg border border-[#e5e5e5] p-4 sm:p-6">
      <div className="flex flex-col items-start gap-4">
        <div className="flex-1 w-full">
          <div className="flex items-center justify-between flex-wrap">
            <div className="flex items-center gap-4 xl:m-0 mr-4">
              <div className="w-32 h-32 flex-shrink-0 relative overflow-hidden rounded-[8px]">
                <Image
                  src={placeholder}
                  alt={name}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-base font-medium">{name}</h3>
            </div>
            <Button
              variant="link"
              className="h-auto p-0 text-[#0066ff] xl:m-0 mt-2"
              onClick={onToggleExpand}
            >
              {isExpanded ? "Show Less" : "Show More"}
            </Button>
          </div>
          {isExpanded && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="w-32 h-32 flex-shrink-0 relative overflow-hidden rounded-[8px]"
                >
                  <Image
                    src={image.url || "/placeholder.svg"}
                    alt={`Medicine ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
          <div className="mt-6">
            <div className="flex items-center">
              <span className="">Similarity Score</span>
              <MarkExcl />
            </div>
            <div className=" mt-2 flex gap-6 flex-wrap">
              <div
                className={`flex flex-col items-center justify-center w-32 h-32 rounded-[8px] p-2 text-center ${
                  totalSimilarity >= 90
                    ? "bg-color-red-danger"
                    : "bg-color-yellow-danger"
                }`}
              >
                <div className="font-bold text-3xl">{totalSimilarity}%</div>
                <div className="text-xl">Total Similarity</div>
              </div>
              <div className="flex flex-col items-center justify-center w-32 h-32 rounded-[8px] bg-color-gray-200 p-2 text-center gap-1">
                <div className="h-10 w-10 rounded-full bg-color-red-danger flex justify-center items-center text-white">
                  <A />
                </div>
                <div className="flex items-center justify-center font-bold  text-2xl">
                  {visualSimilarity}%
                </div>
                <div className="text-lg text-color-gray-400">By Visual</div>
              </div>
              <div className="flex flex-col items-center justify-center w-32 h-32 rounded-[8px] bg-color-gray-200 p-2 text-center gap-1">
                <div className="h-10 w-10 rounded-full bg-color-red-danger flex justify-center items-center text-white">
                  <Drop />
                </div>
                <div className="font-bold text-2xl">{textSimilarity}%</div>
                <div className="text-lg text-color-gray-400">By Text</div>
              </div>
              <div className="flex flex-col items-center justify-center w-32 h-32 rounded-[8px] bg-color-gray-200 p-2 text-center gap-1">
                <div className="h-10 w-10 rounded-full bg-color-yellow-danger flex justify-center items-center text-white">
                  <Pills />
                </div>
                <div className="flex items-center justify-center font-bold text-2xl ">
                  {boxSimilarity}%
                </div>
                <div className="text-lg text-color-gray-400">By Box</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MedicineDetailPage() {
  const [medicineData, setMedicineData] = useState(initialMedicineData);
  const [activeTab, setActiveTab] = useState("medication");
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [showAllImages, setShowAllImages] = useState(false);
  const [sortOrder, setSortOrder] = useState<"new" | "old">("new");
  const [starredOnly, setStarredOnly] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);

  const handleToggleExpand = (name: string) => {
    setExpandedCard(expandedCard === name ? null : name);
  };

  const handleDecline = (reason: string) => {
    console.log("Declining with reason:", reason);
    setShowDeclineModal(false);
    setMedicineData((prevData) => ({ ...prevData, status: "Decline" }));
  };

  const handleApprove = () => {
    setShowApproveModal(true);
    setTimeout(() => {
      setShowApproveModal(false);
      // Here you would typically redirect to the certified page
      console.log("Medicine approved and moved to certified list");
    }, 2000);
  };

  // Filter and sort remarks
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
    <div className="min-h-screen bg-color-gray-200 p-2 sm:p-6 ">
      <div className="flex gap-6 flex-wrap lg:flex-nowrap">
        <div className="flex-[58%] flex flex-col gap-6  overflow-y-auto bg-white border-[1px] border-color-gray-250 rounded-[8px]">
          {/* Main Content */}
          <div className="p-2 sm:p-6 min-h-[calc(100vh-3rem)]">
            <div className="">
              <Link
                href="/dashboard"
                className="inline-flex items-center text-logoblue hover:underline"
              >
                <ArrowLeft className="w-4 h-4 mr-2" color="#0165FC" />
                Back
              </Link>
            </div>
            {/* Image Grid */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-6 pt-2 justify-center sm:justify-start">
                {(showAllImages
                  ? medicineData.images
                  : medicineData.images.slice(0, 8)
                ).map((image, index) => (
                  <div
                    key={index}
                    className="w-32 h-32 flex-shrink-0 relative overflow-hidden rounded-[8px]"
                  >
                    <Image
                      src={image.url || "/placeholder.svg"}
                      alt={`Medicine ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
              {medicineData.images.length > 8 && (
                <Button
                  variant="link"
                  className="text-logoblue"
                  onClick={() => setShowAllImages(!showAllImages)}
                >
                  {showAllImages ? "Show Less" : "Show More"}
                </Button>
              )}
            </div>

            {/* Title and Actions */}
            <div className="flex items-center justify-between mb-8 flex-wrap sm:flex-nowrap ">
              <div className="flex flex-col items-start gap-1">
                <Badge
                  variant="outline"
                  className={`whitespace-nowrap py-2 ${
                    medicineData.status === "Pending"
                      ? "border-[#fdd3d0] bg-[#fdd3d0] text-[#ec221f]"
                      : "border-[#ddc3ff] bg-[#ddc3ff] text-[#7307ff]"
                  }
                  `}
                >
                  {medicineData.status}
                </Badge>
                <h1 className="text-2xl font-semibold text-nowrap mr-2">
                  {medicineData.name}
                </h1>
              </div>
              <div className="flex flex-wrap gap-1 lg:gap-3">
                <Button
                  variant="outline"
                  className="flex justify-center items-center w-fit xl:w-[8rem] xl:gap-3 gap-1 bg-logoblue text-white rounded-[8px] mt-2 sm:mt-0 hover:bg-blue-700 hover:text-white"
                >
                  <PencilIcon />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  className="flex justify-center items-center w-fit xl:w-[8rem] xl:gap-3 gap-1 bg-logoblue text-white rounded-[8px] mt-2 sm:mt-0 hover:bg-blue-700 hover:text-white"
                  onClick={() => setShowDeclineModal(true)}
                >
                  <DeclineIcon />
                  Decline
                </Button>
                <Button
                  className="flex justify-center items-center w-fit xl:w-[8rem] xl:gap-3 gap-1 bg-logoblue text-white rounded-[8px] mt-2 sm:mt-0 hover:bg-blue-700 hover:text-white"
                  onClick={handleApprove}
                >
                  <CheckIconSmall />
                  Approve
                </Button>
              </div>
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
                <div className="xl:w-[calc(50vw-3rem)] w-full grid md:grid-cols-2 gap-8 mt-3">
                  <div className="space-y-4">
                    <h2 className="font-semibold">Basic Product Information</h2>
                    <div>
                      <label className="block text-sm mb-1">Product Name</label>
                      <Input
                        value={medicineData.name}
                        readOnly
                        className="rounded-[8px] mt-1 border-color-gray-250"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Category</label>
                      <Input
                        value={medicineData.category}
                        readOnly
                        className="rounded-[8px] mt-1 border-color-gray-250"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">
                        Intake Method
                      </label>
                      <Input
                        value={medicineData.intakeMethod}
                        readOnly
                        className="rounded-[8px] mt-1 border-color-gray-250"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">
                        Manufactured country
                      </label>
                      <Input
                        value={medicineData.manufacturedCountry}
                        readOnly
                        className="rounded-[8px] mt-1 border-color-gray-250"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">
                        Country of registration
                      </label>
                      <Input
                        value={medicineData.registrationCountry}
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
                        value={medicineData.catalogNumber}
                        readOnly
                        className="rounded-[8px] mt-1 border-color-gray-250"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">ID</label>
                      <Input
                        value={medicineData.id}
                        readOnly
                        className="rounded-[8px] mt-1 border-color-gray-250"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Logistic</label>
                      <Input
                        value={medicineData.logistic}
                        readOnly
                        className="rounded-[8px] mt-1 border-color-gray-250"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">
                        Quantity in packaging
                      </label>
                      <Input
                        value={medicineData.quantity}
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
                <div className="xl:w-[calc(50vw-3rem)] w-full grid md:grid-cols-2 gap-8 mt-3">
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
                          value={medicineData.status}
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
        <div className="flex-[42%] flex flex-col min-h-[calc(100vh-3rem)] overflow-y-auto">
          {/* LASA Analysis */}
          <div className="w-full  border-[1px] border-color-gray-250 rounded-[8px]">
            <div className="bg-white  min-h-[calc(100vh-3rem)] p-4 sm:p-6 rounded-[8px]">
              <h2 className="mb-4 text-xl font-semibold">LASA Analysis</h2>
              <h3 className="mb-6">Results for: {medicineData.name}</h3>

              <div className="space-y-4">
                {similarityData.map((item, index) => (
                  <SimilarityCard
                    key={index}
                    {...item}
                    isExpanded={expandedCard === item.name}
                    onToggleExpand={() => handleToggleExpand(item.name)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <DeclineModal
        isOpen={showDeclineModal}
        onClose={() => setShowDeclineModal(false)}
        onConfirm={handleDecline}
      />
      <ApproveModal
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
      />
    </div>
  );
}
