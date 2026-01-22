"use client"

interface SectionHeaderProps {
  number: number
  title: string
  subtitle?: string
  className?: string
}

export function SectionHeader({
  number,
  title,
  subtitle,
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`flex items-start gap-6 mb-8 max-w-[900px] mx-auto ${className}`}>
      <div className="text-[#761D78] text-4xl flex items-center justify-center font-regular flex-shrink-0 mt-1">
        {number}.
      </div>
      <div>
        <h2 className="text-3xl font-regular text-[#080936] leading-snug">
          {title}
        </h2>
        {subtitle && (
          <p className="text-gray-600 mb-4">{subtitle}</p>
        )}
      </div>
    </div>
  )
}
