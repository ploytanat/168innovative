import type { Metadata } from "next"

import NotFoundView from "@/app/components/ui/NotFoundView"

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

export default function NotFound() {
  return <NotFoundView locale="en" />
}
