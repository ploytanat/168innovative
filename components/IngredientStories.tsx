import Image from "next/image"

import type { StoryModel } from "@/types/homepage"

interface IngredientStoriesProps {
  stories: StoryModel[]
}

export default function IngredientStories({ stories }: IngredientStoriesProps) {
  return (
    <section id="ingredient-stories" className="bg-[#fdfcf5] py-[40px] text-center">
      <div className="mx-auto max-w-[1200px] px-[20px]">
        <h2 className="mb-[20px] text-[24px] font-bold uppercase text-[#333]">
          Ingredient Stories
        </h2>
        <div className="mt-[30px] grid grid-cols-8 gap-[15px]">
          {stories.map((story) => (
            <a key={story.id} href={story.href} className="block">
              <div className="relative mx-auto mb-[10px] h-[80px] w-[80px] overflow-hidden rounded-full border-[2px] border-white shadow-[0_2px_5px_rgba(0,0,0,0.1)]">
                <Image
                  src={story.image.src}
                  alt={story.image.alt}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
              <div className="text-[12px] font-bold uppercase text-[#333]">
                {story.name}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
