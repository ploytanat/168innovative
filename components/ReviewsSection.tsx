import Image from "next/image"

import type { ReviewModel } from "@/types/homepage"

interface ReviewsSectionProps {
  reviews: ReviewModel[]
  reviewCountLabel: string
}

export default function ReviewsSection({
  reviews,
  reviewCountLabel,
}: ReviewsSectionProps) {
  return (
    <section className="bg-[#f9f9f9] py-[60px] text-center">
      <div className="mx-auto max-w-[1200px] px-[20px]">
        <div className="mb-[40px]">
          <h2 className="mb-[20px] text-[24px] font-bold uppercase text-[#333]">
            Reviews with Love
          </h2>
          <p className="mt-[10px] text-[14px] font-bold uppercase text-[#777]">
            {reviewCountLabel}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-[30px]">
          {reviews.map((review) => (
            <article
              key={review.id}
              className="relative rounded-[8px] bg-white p-[30px] text-left shadow-[0_2px_5px_rgba(0,0,0,0.05)]"
            >
              <div className="absolute top-[30px] right-[30px] text-[18px] text-[#fbc02d]">
                {review.stars}
              </div>
              <p className="mb-[20px] text-[15px] italic text-[#555]">
                &quot;{review.quote}&quot;
              </p>
              <div className="flex items-center gap-[15px]">
                <div className="relative h-[50px] w-[50px] overflow-hidden rounded-full bg-[#ccc]">
                  <Image
                    src={review.avatar.src}
                    alt={review.avatar.alt}
                    fill
                    sizes="50px"
                    className="object-cover"
                  />
                </div>
                <div className="text-[14px]">
                  <p className="font-bold text-[#333]">{review.name}</p>
                  <p className="text-[#333]">{review.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
