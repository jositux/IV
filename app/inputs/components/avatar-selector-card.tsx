"use client"

import React from "react"

import { Card } from "@/components/ui/card"
import { Loader2, Play, Check } from "lucide-react"
import type { Replica } from "@/services/video/video-replicas"

interface AvatarSelectorCardProps {
  replicas: Replica[]
  loadingReplicas: boolean
  selectedReplica: string
  onSelectReplica: (replicaId: string) => void
  onPlayVideo: (videoUrl: string, replicaName: string, e: React.MouseEvent) => void
}

export function AvatarSelectorCard({
  replicas,
  loadingReplicas,
  selectedReplica,
  onSelectReplica,
  onPlayVideo,
}: AvatarSelectorCardProps) {
  return (
    <Card className="p-0 border-0 shadow-none mb-8">
      {loadingReplicas ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-3 text-gray-600">Loading avatars...</span>
        </div>
      ) : replicas.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No avatars available
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {replicas.slice(0, 100).map((replica) => (
              <div key={replica.replica_id} className="text-center">
                <div
                  className={`relative rounded-xl border border-[#DADADA] overflow-hidden transition-all duration-300 ${
                    selectedReplica === replica.replica_id
                      ? "bg-[#0B0F3A] shadow-xl scale-[1.02]"
                      : "bg-white hover:shadow-lg hover:bg-white"
                  }`}
                >
                  <div
                    onClick={() => onSelectReplica(replica.replica_id)}
                    className="relative aspect-square flex items-center justify-center cursor-pointer"
                  >
                    <div
                      className={`absolute inset-0 p-3 transition-colors ${
                        selectedReplica === replica.replica_id ? "bg-[#0B0F3A]" : "bg-white"
                      }`}
                    >
                      <img
                        src={`/assets/avatars/${replica.replica_id}.jpg`}
                        alt={replica.replica_name}
                        className="w-full h-full object-cover rounded-[8px]"
                      />
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center -z-10">
                      <span className="text-4xl font-bold text-gray-200">
                        {replica.replica_name[0]} 
                      </span>
                    </div>

                    {replica.thumbnail_video_url && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onPlayVideo(
                              replica.thumbnail_video_url,
                              replica.replica_name,
                              e
                            )
                          }}
                          className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all"
                        >
                          <Play className="w-6 h-6 text-[#0B0F3A] fill-[#0B0F3A] ml-1" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div
                    onClick={() => onSelectReplica(replica.replica_id)}
                    className={`py-3 px-4 flex items-center justify-between cursor-pointer transition-colors ${
                      selectedReplica === replica.replica_id
                        ? "bg-[#0B0F3A] text-white"
                        : "bg-white text-gray-900 border-t border-gray-100"
                    }`}
                  >
                    <p className="text-lg font-semibold truncate">
                      {replica.replica_name}
                    </p>

                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                        selectedReplica === replica.replica_id
                          ? "bg-white text-[#0B0F3A]"
                          : "bg-gray-100 text-transparent"
                      }`}
                    >
                      <Check strokeWidth={4} className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-start gap-6 mb-8 max-w-[900px] mx-auto">
            <p className="text-[16px] sm:text-[16px] text-gray-700">
              <strong>Authentic Digital Human Technology.</strong> While
              typical AI avatars only animate the lower face, our advanced
              3D rendering captures every subtle movement that creates
              genuine human presence with pixel-perfect lip
              synchronization and consistent identity preservation that
              crosses the threshold from AI-generated to indistinguishable
              from human video.
            </p>
          </div>
        </>
      )}
    </Card>
  )
}
