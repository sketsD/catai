"use client";

import { useEffect, useState, useCallback } from "react";
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
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getMedicineByName } from "@/store/slices/medicineSlice";
import { Medicine, LASAAnalysisResponse } from "@/types/global";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import { medicineService } from "@/utils/medicineService";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { getPublicS3Url } from "@/utils/s3Utils";
import { ImagePreviewModal } from "@/components/image-preview-modal";
import { getLocalStorage } from '@/utils/localStorage';

// Mock data - would come from API in real app
// const initialMedicineData = {
//   id: "123456789",
//   name: "Cefotaxime Medo",
//   status: "Pending" as "Pending" | "Decline",
//   category: "Ampoules",
//   intakeMethod: "IM;IV",
//   catalogNumber: "7290015842006",
//   logistic: "135A678",
//   manufacturedCountry: "Cyprus",
//   registrationCountry: "Israel",
//   quantity: "-",
//   images: Array(9).fill({ url: placeholder }),
// };

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

export default function MedicineDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { toast } = useToast();
  const { error, currentMedicine, loading } = useAppSelector(
    (state) => state.medicine
  );
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("medication");
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [showAllImages, setShowAllImages] = useState(false);
  const [sortOrder, setSortOrder] = useState<"new" | "old">("new");
  const [starredOnly, setStarredOnly] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<Medicine | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [lasaData, setLasaData] = useState<LASAAnalysisResponse | null>(null);
  const [lasaLoading, setLasaLoading] = useState(false);
  const [lasaError, setLasaError] = useState<string | null>(null);

  const fetchLASAAnalysis = useCallback(async () => {
    try {
      const token = getLocalStorage("auth-token");
      if (!token || !params.id) return;

      setLasaLoading(true);
      setLasaError(null);
      console.log("[View] Starting LASA fetch");
      const response = await medicineService.getLASAAnalysis({
        responseId: params.id,
        token
      });
      console.log("[View] LASA fetch success:", response.data);
      setLasaData(response.data);
    } catch (error: any) {
      console.log("[View] LASA fetch error state triggered");
      console.log("[View] Error full object:", error);
      console.log("[View] Error response:", error.response);
      console.log("[View] Current lasaData state:", lasaData);
      // Обрабатываем ошибку axios
      const errorMessage = error?.response?.data?.detail || // API error detail
                          error?.message || // Axios error message
                          error?.response?.data?.message || // API error message
                          "Failed to load LASA analysis";
      console.log("[View] Setting error message:", errorMessage);
      setLasaData(null); // Очищаем данные при ошибке
      setLasaError(errorMessage);
    } finally {
      setLasaLoading(false);
      console.log("[View] Final states - error:", lasaError, "data:", lasaData, "loading:", lasaLoading);
    }
  }, [params.id]);

  useEffect(() => {
    dispatch(getMedicineByName(params.id));
  }, [dispatch, params.id]);

  useEffect(() => {
    if (currentMedicine?.at(0)) {
      setEditedData(currentMedicine.at(0) as Medicine);
    }
  }, [currentMedicine]);

  useEffect(() => {
    fetchLASAAnalysis();
  }, [params.id, fetchLASAAnalysis]);

  const data = currentMedicine?.at(0);

  const handleToggleExpand = (name: string) => {
    setExpandedCard(expandedCard === name ? null : name);
  };

  const handleDecline = async (reason: string) => {
    try {
      const token = getLocalStorage("auth-token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      await medicineService.updateMedicineStatus({
        medicine: data as Medicine,
        token,
        newStatus: "completed"
      });
      
      toast({
        className: "bg-white border-none",
        description: (
          <div className="flex flex-col items-center justify-center p-3 w-full bg-white">
            <CheckCircle2 className="w-16 h-16 text-[#14ae5c] mb-4" />
            <p className="text-xl font-semibold text-center w-full">Medicine status updated to Completed</p>
            {reason && <p className="text-sm text-gray-500 text-center">Reason: {reason}</p>}
          </div>
        ),
      });
      
      setShowDeclineModal(false);
      // Refresh the medicine data
      dispatch(getMedicineByName(params.id));
    } catch (error) {
      console.error("Failed to decline medicine:", error);
      toast({
        variant: "destructive",
        className: "bg-white border-none",
        description: (
          <div className="flex flex-col items-center justify-center p-3 w-full bg-white">
            <AlertCircle className="h-10 w-10 text-[#ec221f]" />
            <p className="text-xl font-semibold text-center w-full">Failed to update medicine status</p>
          </div>
        ),
      });
    }
  };

  const handleApprove = async () => {
    try {
      const token = getLocalStorage("auth-token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      await medicineService.updateMedicineStatus({
        medicine: data as Medicine,
        token,
        newStatus: "approved"
      });
      
      toast({
        className: "bg-white border-none",
        description: (
          <div className="flex flex-col items-center justify-center p-3 w-full bg-white">
            <CheckCircle2 className="w-16 h-16 text-[#14ae5c] mb-4" />
            <p className="text-xl font-semibold text-center w-full">Medicine status updated to Approved</p>
          </div>
        ),
      });

      setShowApproveModal(false);
      
      // Refresh the medicine data after a delay
      setTimeout(() => {
        dispatch(getMedicineByName(params.id));
      }, 2000);
    } catch (error) {
      console.error("Failed to approve medicine:", error);
      toast({
        variant: "destructive",
        className: "bg-white border-none",
        description: (
          <div className="flex flex-col items-center justify-center p-3 w-full bg-white">
            <AlertCircle className="h-10 w-10 text-[#ec221f]" />
            <p className="text-xl font-semibold text-center w-full">Failed to update medicine status</p>
          </div>
        ),
      });
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(data as Medicine);
  };

  const handleSave = async () => {
    if (!editedData || !data) return;

    try {
      const token = getLocalStorage("auth-token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await medicineService.updateMedicine({ 
        medicine: editedData,
        originalMedicine: data,
        token 
      });
      
      // If medicine name was updated, update the URL and redirect
      if (editedData.product_name !== data.product_name) {
        router.replace(`/dashboard/medicines/${editedData.product_name}`);
      }
      
      // Refresh the data with new name if changed
      dispatch(getMedicineByName(editedData.product_name as string));
      
      // Show success message with updated fields
      const updatedFields = Object.entries(response)
        .filter(([_, updated]) => updated)
        .map(([field]) => field)
        .join(", ");
      
      if (updatedFields) {
        toast({
          description: (
            <div className="flex flex-col items-center justify-center p-3 w-full">
              <CheckCircle2 className="w-16 h-16 text-[#14ae5c] mb-4" />
              <p className="text-xl font-semibold text-center w-full">Medicine successfully updated</p>
              <p className="text-sm text-gray-500 text-center">Updated fields: {updatedFields}</p>
            </div>
          ),
        });
      } else {
        toast({
          description: (
            <div className="flex flex-col items-center justify-center p-3 w-full">
              <AlertCircle className="h-10 w-10 text-[#14ae5c]" />
              <p className="text-xl font-semibold text-center w-full">No changes were made</p>
            </div>
          ),
        });
      }
      
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update medicine:", error);
      toast({
        variant: "destructive",
        description: (
          <div className="flex flex-col items-center justify-center p-3 w-full">
            <AlertCircle className="h-10 w-10 text-[#ec221f]" />
            <p className="text-xl font-semibold text-center w-full">Failed to update medicine</p>
          </div>
        ),
      });
    }
  };

  const handleInputChange = (field: keyof Medicine, value: string) => {
    if (editedData) {
      setEditedData({ ...editedData, [field]: value });
    }
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

  return (
    <div className="min-h-screen bg-color-gray-200 p-2 sm:p-6">
      <div className="flex gap-6 flex-wrap lg:flex-nowrap">
        <div className="flex-[58%] flex flex-col gap-6 overflow-y-auto bg-white border-[1px] border-color-gray-250 rounded-[8px]">
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

            <div className="flex items-center justify-between mb-8 flex-wrap sm:flex-nowrap">
              <div className="flex flex-col items-start gap-1">
                <Badge
                  variant="outline"
                  className={`whitespace-nowrap py-2 ${
                    data.status === "pending"
                      ? "border-[#fdd3d0] bg-[#fdd3d0] text-[#ec221f]"
                      : "border-[#ddc3ff] bg-[#ddc3ff] text-[#7307ff]"
                  }
                `}
                >
                  {data.status}
                </Badge>
                <h1 className="text-2xl font-semibold text-nowrap mr-2">
                  {data.product_name}
                </h1>
              </div>
              <div className="flex flex-wrap gap-1 lg:gap-3">
                {isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      className="flex justify-center items-center w-fit xl:w-[8rem] xl:gap-3 gap-1 border-logoblue text-logoblue rounded-[8px] mt-2 sm:mt-0 hover:bg-gray-100 [&>svg]:text-logoblue"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex justify-center items-center w-fit xl:w-[8rem] xl:gap-3 gap-1 bg-logoblue text-white rounded-[8px] mt-2 sm:mt-0 hover:bg-blue-700"
                      onClick={handleSave}
                    >
                      Save
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="flex justify-center items-center w-fit xl:w-[8rem] xl:gap-3 gap-1 border-logoblue text-logoblue rounded-[8px] mt-2 sm:mt-0 hover:bg-gray-100 [&>svg]:text-logoblue"
                      onClick={handleEdit}
                    >
                      <PencilIcon />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      className={`flex justify-center items-center w-fit xl:w-[8rem] xl:gap-3 gap-1 text-[#ec221f] rounded-[8px] mt-2 sm:mt-0 hover:bg-red-50 [&>svg]:text-[#ec221f] ${data.status === "completed" ? "opacity-50 cursor-not-allowed" : ""}`}
                      onClick={() => setShowDeclineModal(true)}
                      disabled={data.status === "completed"}
                    >
                      <DeclineIcon />
                      Decline
                    </Button>
                    <Button
                      className={`flex justify-center items-center w-fit xl:w-[8rem] xl:gap-3 gap-1 bg-[#14ae5c] text-white rounded-[8px] mt-2 sm:mt-0 hover:bg-[#119a50] [&>svg]:text-white ${data.status === "approved" ? "opacity-50 cursor-not-allowed" : ""}`}
                      onClick={handleApprove}
                      disabled={data.status === "approved"}
                    >
                      <CheckIconSmall />
                      Approve
                    </Button>
                  </>
                )}
              </div>
            </div>

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
                className="space-y-6 border-t-[1px] mt-0"
              >
                <div className="xl:w-[calc(50vw-3rem)] w-full grid md:grid-cols-2 gap-8 mt-3">
                  <div className="space-y-4">
                    <h2 className="font-semibold">Basic Product Information</h2>
                    <div>
                      <label className="block text-sm mb-1">Product Name</label>
                      <Input
                        value={editedData?.product_name || ''}
                        readOnly={!isEditing}
                        onChange={(e) => handleInputChange('product_name', e.target.value)}
                        className="rounded-[8px] mt-1 border-color-gray-250"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Category</label>
                      <Input
                        value={editedData?.category || ''}
                        readOnly={!isEditing}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="rounded-[8px] mt-1 border-color-gray-250"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Intake Method</label>
                      <Input
                        value={editedData?.intake_method || ''}
                        readOnly={!isEditing}
                        onChange={(e) => handleInputChange('intake_method', e.target.value)}
                        className="rounded-[8px] mt-1 border-color-gray-250"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Manufactured country</label>
                      <Input
                        value={editedData?.manufacturing_country || ''}
                        readOnly={!isEditing}
                        onChange={(e) => handleInputChange('manufacturing_country', e.target.value)}
                        className="rounded-[8px] mt-1 border-color-gray-250"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Country of registration</label>
                      <Input
                        value={editedData?.country_registration || ''}
                        readOnly={!isEditing}
                        onChange={(e) => handleInputChange('country_registration', e.target.value)}
                        className="rounded-[8px] mt-1 border-color-gray-250"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="font-semibold">Identification Data</h2>
                    <div>
                      <label className="block text-sm mb-1">Catalog Number / Barcode</label>
                      <Input
                        value={editedData?.barcode || ''}
                        readOnly={!isEditing}
                        onChange={(e) => handleInputChange('barcode', e.target.value)}
                        className="rounded-[8px] mt-1 border-color-gray-250"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">ID</label>
                      <Input
                        value={editedData?.metadata_id || ''}
                        readOnly={true}
                        className="rounded-[8px] mt-1 border-color-gray-250"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Logistic</label>
                      <Input
                        value={editedData?.manufacturer || ''}
                        readOnly={!isEditing}
                        onChange={(e) => handleInputChange('manufacturer', e.target.value)}
                        className="rounded-[8px] mt-1 border-color-gray-250"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Quantity in packaging</label>
                      <Input
                        value={editedData?.type_packaging || ''}
                        readOnly={!isEditing}
                        onChange={(e) => handleInputChange('type_packaging', e.target.value)}
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
                          value={data.status as string}
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
          <div className="w-full border-[1px] border-color-gray-250 rounded-[8px]">
            <div className="bg-white min-h-[calc(100vh-3rem)] p-4 sm:p-6 rounded-[8px]">
              <h2 className="mb-4 text-xl font-semibold">LASA Analysis</h2>
              <h3 className="mb-6">
                Results for: {data.product_name}
              </h3>

              <div className="space-y-6">
                {lasaLoading ? (
                  <div className="flex flex-col justify-center items-center min-h-[200px] gap-4">
                    <Spinner className="w-8 h-8" />
                    <p className="text-gray-500">Loading LASA analysis...</p>
                  </div>
                ) : lasaError ? (
                  <div className="flex flex-col items-center justify-center min-h-[200px] p-6 bg-red-50 rounded-lg border border-red-200">
                    <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                    <p className="text-red-600 text-center font-medium mb-2">Error Loading LASA Analysis</p>
                    <p className="text-red-500 text-center text-sm">{lasaError}</p>
                    <Button 
                      variant="outline" 
                      className="mt-4 text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => {
                        setLasaError(null);
                        fetchLASAAnalysis();
                      }}
                    >
                      Try Again
                    </Button>
                  </div>
                ) : lasaData ? (
                  <SimilarityCard
                    name={lasaData.ProductName}
                    totalSimilarity={Math.max(...lasaData.TextSimilarity, ...lasaData.ImageSimilarity)}
                    visualSimilarity={Math.max(...lasaData.ImageSimilarity)}
                    textSimilarity={Math.max(...lasaData.TextSimilarity)}
                    boxSimilarity={Math.max(...lasaData.ImageSimilarity)}
                    images={lasaData.TextSimilarityImages.map(url => ({ url }))}
                    isExpanded={expandedCard === lasaData.ProductName}
                    onToggleExpand={() => handleToggleExpand(lasaData.ProductName)}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center min-h-[200px] p-6 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                      <Pills className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600 text-center font-medium">No LASA Analysis Available</p>
                    <p className="text-gray-500 text-center text-sm mt-2">No similar medicines were found for this product</p>
                  </div>
                )}
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
