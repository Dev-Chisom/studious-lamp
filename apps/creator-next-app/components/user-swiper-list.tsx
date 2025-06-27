"use client"

import { useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination } from "swiper/modules"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { SuggestionUser } from "@/types/dashboard"

// Import Swiper styles
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

interface UserSwiperListProps {
  users: SuggestionUser[]
  title: string
  usersPerSlide?: number
}

export default function UserSwiperList({ users, title, usersPerSlide = 3 }: UserSwiperListProps) {
  const [swiper, setSwiper] = useState<any>(null)

  if (!users || users.length === 0) {
    return (
      <div className="mb-6">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p className="text-sm">No users to show</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">{title}</h3>
        {users.length > usersPerSlide && (
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => swiper?.slidePrev()}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => swiper?.slideNext()}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={12}
        slidesPerView={1}
        onSwiper={setSwiper}
        breakpoints={{
          640: {
            slidesPerView: Math.min(2, usersPerSlide),
          },
          768: {
            slidesPerView: Math.min(3, usersPerSlide),
          },
          1024: {
            slidesPerView: usersPerSlide,
          },
        }}
        className="user-swiper"
      >
        {users.map((user) => (
          <SwiperSlide key={user.id}>
            <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
              {/* Banner */}
              <div className="relative h-20 bg-gradient-to-r from-pink-400 to-purple-500">
                {user.banner && (
                  <img src={user.banner || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                )}
                {user.expired && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    Expired
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-3 -mt-6 relative">
                {/* Avatar */}
                <div className="flex justify-center mb-2">
                  <img
                    src={user.avatar || "/placeholder.svg"}
                    alt={user.name}
                    className="w-12 h-12 rounded-full border-3 border-white dark:border-gray-800 object-cover"
                  />
                </div>

                {/* User Info */}
                <div className="text-center">
                  <h4 className="font-semibold text-sm text-gray-900 dark:text-white truncate">{user.name}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">@{user.username}</p>
                </div>

                {/* Action Button */}
                <div className="mt-3">
                  <Button
                    size="sm"
                    className={`w-full text-xs ${
                      user.expired
                        ? "bg-orange-500 hover:bg-orange-600"
                        : "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                    }`}
                  >
                    {user.expired ? "Renew" : "Subscribe"}
                  </Button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Swiper Styles */}
      <style jsx global>{`
        .user-swiper .swiper-slide {
          height: auto;
        }
      `}</style>
    </div>
  )
}
