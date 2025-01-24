"use client"

import { useState } from "react"
import Image from "next/image"
import { Eye, Box } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MedicineComparisonCardProps {
  name: string
  totalSimilarity: number
  visualSimilarity: number
  textSimilarity: number
  boxSimilarity: number
}

export function MedicineComparisonCard({
  name,
  totalSimilarity,
  visualSimilarity,
  textSimilarity,
  boxSimilarity,
}: MedicineComparisonCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="border rounded-lg p-4">
      <div className="space-y-4">
        {/* Images Section */}
        <div className="space-y-4">
          {!isExpanded ? (
            // Collapsed view - single image
            <div className="flex items-start gap-4">
              <div className="aspect-square relative w-20 border rounded-lg overflow-hidden">
                <Image src="/placeholder.svg" alt="Medicine" fill className="object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{name}</h4>
                  <Button variant="link" className="text-[#0066ff] p-0 h-auto" onClick={() => setIsExpanded(true)}>
                    Show More
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            // Expanded view - grid of images
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{name}</h4>
                <Button variant="link" className="text-[#0066ff] p-0 h-auto" onClick={() => setIsExpanded(false)}>
                  Show Less
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="aspect-square relative border rounded-lg overflow-hidden">
                    <Image src="/placeholder.svg" alt="Medicine" fill className="object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Similarity Scores */}
        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span>Similarity Score</span>
            <Button variant="link" size="sm" className="text-[#0066ff] p-0 h-auto">
              ?
            </Button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <div className={`p-2 rounded-lg text-center ${totalSimilarity >= 90 ? "bg-[#fdd3d0]" : "bg-[#e8b931]"}`}>
              <div className="font-bold">{totalSimilarity}%</div>
              <div className="text-xs">Total Similarity</div>
            </div>
            <div className="bg-[#f5f5f5] p-2 rounded-lg text-center">
              <div className="font-bold flex items-center justify-center">
                <Eye className="w-4 h-4 mr-1" />
                {visualSimilarity}%
              </div>
              <div className="text-xs">By Visual</div>
            </div>
            <div className="bg-[#f5f5f5] p-2 rounded-lg text-center">
              <div className="font-bold">{textSimilarity}%</div>
              <div className="text-xs">By Text</div>
            </div>
            <div className="bg-[#f5f5f5] p-2 rounded-lg text-center">
              <div className="font-bold flex items-center justify-center">
                <Box className="w-4 h-4 mr-1" />
                {boxSimilarity}%
              </div>
              <div className="text-xs">By Box</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

