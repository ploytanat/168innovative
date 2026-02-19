'use client'

import Link, { LinkProps } from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

interface Props extends LinkProps {
  children: ReactNode
  className?: string
}

export default function LocalizedLink({
  href,
  children,
  className,
  ...rest
}: Props) {
  const pathname = usePathname()
  const isEN = pathname.startsWith('/en')

  let finalHref = href as string

  if (isEN) {
    finalHref =
      href === '/'
        ? '/en'
        : `/en${href}`
  }

  return (
    <Link href={finalHref} className={className} {...rest}>
      {children}
    </Link>
  )
}
