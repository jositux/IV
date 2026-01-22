"use client"

import { Card } from "@/components/ui/card"
import { ADDITIONAL_PRODUCTS } from "../types"

interface AdditionalProductsCardProps {
  selectedProducts: string[]
  onToggleProduct: (title: string) => void
}

export function AdditionalProductsCard({
  selectedProducts,
  onToggleProduct,
}: AdditionalProductsCardProps) {
  return (
    <Card className="p-4 sm:p-8 mb-8">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
          5
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            Additional Products (Optional)
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ADDITIONAL_PRODUCTS.map((product) => (
          <Card
            key={product.title}
            onClick={() => onToggleProduct(product.title)}
            className={`p-4 cursor-pointer transition-all ${
              selectedProducts.includes(product.title)
                ? "ring-2 ring-indigo-500 bg-indigo-50"
                : ""
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">{product.title}</h3>
              <span className="text-sm font-bold text-blue-600">
                {product.credits} credits
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{product.description}</p>
            <ul className="space-y-1">
              {product.features.map((feature, idx) => (
                <li
                  key={idx}
                  className="text-xs text-gray-700 flex items-center gap-1"
                >
                  <span className="text-green-500">&#10003;</span>
                  {feature}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </Card>
  )
}
