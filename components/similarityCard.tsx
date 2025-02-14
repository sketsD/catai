"use client";

import { getPublicS3Url } from "@/utils/s3Utils";
import Image from "next/image";
import { Button } from "./ui/button";
import MarkExcl from "./ui/MarkExcl";
import { getColorFromPercentage } from "@/utils/helpers";
import Drop from "./ui/Drop";
import Pills from "./ui/Pills";
import A from "./ui/A";
import { useState } from "react";
import { ImagePreviewModal } from "./image-preview-modal";

export default function SimilarityCard({
  name,
  ImageLocation,
  totalSimilarity,
  visualSimilarity,
  textSimilarity,
  boxSimilarity,
  images,
}: //   isExpanded,
//   onToggleExpand,
{
  name: string;
  ImageLocation: string;
  totalSimilarity: number;
  visualSimilarity: number;
  textSimilarity: number;
  boxSimilarity: number;
  images: { url: string }[];
  //   isExpanded: boolean;
  //   onToggleExpand: () => void;
}) {
  const [isExpanded, setExpanded] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const toggleExpand = () => {
    setExpanded((prev) => !prev);
  };
  const allImages = [
    `s3://pharmacy-sheba/${ImageLocation}`,
    ...images.map((image) => `s3://pharmacy-sheba/${image.url}`),
  ];
  // console.log(allImages);
  return (
    <>
      <div className="border border-[#e5e5e5] p-4 sm:p-6 rounded-[8px]">
        <div className="flex flex-col items-start gap-4">
          <div className="flex-1 w-full">
            <div className="flex items-center justify-between flex-wrap">
              <div className="flex items-center gap-4 xl:m-0 mr-4">
                <div
                  className="w-32 h-32 flex-shrink-0 relative overflow-hidden rounded-[8px] cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setSelectedImage(0)}
                >
                  {/* <Image
                    src={placeholder}
                    alt={name}
                    fill
                    className="object-cover"
                  /> */}
                  {/* {images.map((image, index) => (
                    <Image
                      src={getPublicS3Url(`s3://pharmacy-sheba${image.url}`)}
                      alt={`Medicine ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  ))} */}

                  <Image
                    src={getPublicS3Url(allImages[0])}
                    alt={`Medicine ${name}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-base font-medium">{name}</h3>
              </div>
              <Button
                variant="link"
                className="h-auto p-0 text-[#0066ff] xl:m-0 mt-2"
                onClick={toggleExpand}
              >
                {isExpanded ? "Show Less" : "Show More"}
              </Button>
            </div>
            {isExpanded && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {allImages.slice(1).map((image, index) => (
                  <div
                    key={index + 1}
                    className="w-32 h-32 flex-shrink-0 relative overflow-hidden rounded-[8px] cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setSelectedImage(index + 1)}
                  >
                    <Image
                      src={getPublicS3Url(image) || "/placeholder.svg"}
                      alt={`Medicine ${name} + ${index + 1}`}
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
                  className={`flex flex-col items-center justify-center w-32 h-32 rounded-[8px] p-2 text-center`}
                  style={{
                    backgroundColor: `#${getColorFromPercentage(
                      totalSimilarity
                    )}`,
                  }}
                >
                  <div className="font-bold text-3xl">{totalSimilarity}%</div>
                  <div className="text-xl">Total Similarity</div>
                </div>
                <div className="flex flex-col items-center justify-center w-32 h-32 rounded-[8px] bg-color-gray-200 p-2 text-center gap-1">
                  <div
                    className="h-10 w-10 rounded-full flex justify-center items-center text-white"
                    style={{
                      backgroundColor: `#${getColorFromPercentage(
                        visualSimilarity
                      )}`,
                    }}
                  >
                    <A />
                  </div>
                  <div className="flex items-center justify-center font-bold  text-2xl">
                    {visualSimilarity}%
                  </div>
                  <div className="text-lg text-color-gray-400">By Visual</div>
                </div>
                <div className="flex flex-col items-center justify-center w-32 h-32 rounded-[8px] bg-color-gray-200 p-2 text-center gap-1">
                  <div
                    className="h-10 w-10 rounded-full flex justify-center items-center text-white"
                    style={{
                      backgroundColor: `#${getColorFromPercentage(
                        textSimilarity
                      )}`,
                    }}
                  >
                    <Drop />
                  </div>
                  <div className="font-bold text-2xl">{textSimilarity}%</div>
                  <div className="text-lg text-color-gray-400">By Text</div>
                </div>
                <div className="flex flex-col items-center justify-center w-32 h-32 rounded-[8px] bg-color-gray-200 p-2 text-center gap-1">
                  <div
                    className="h-10 w-10 rounded-full  flex justify-center items-center text-white"
                    style={{
                      backgroundColor: `#${getColorFromPercentage(
                        boxSimilarity
                      )}`,
                    }}
                  >
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
      {/* <ImagePreviewModal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        imageUrl={selectedImage ? getPublicS3Url(selectedImage) : ""}
      /> */}
      <ImagePreviewModal
        isOpen={selectedImage !== null}
        onClose={() => setSelectedImage(null)}
        images={allImages as Array<string>}
        selectedImage={selectedImage}
        onImageChange={(index) => setSelectedImage(index)}
      />
    </>
  );
}
