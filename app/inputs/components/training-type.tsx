"use client"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"

// Puedes importar esto de tu archivo de constantes o definirlo aquí
const TRAINING_OPTIONS = ["Compliance & Safety",
"Sales Enablement",
"Employee Orientation",
"Marketing & Product",
"Learning & Development",
"Internal Communications",
"Customer Service",];

interface TrainingTypeCardProps {
  trainingType: string 
  customTrainingType: string
  customTrainingOptions: string[]
  onTrainingTypeChange: (value: string) => void
  onCustomTrainingChange: (value: string) => void
  onCustomTrainingOptionsChange: (options: string[]) => void
}

export function TrainingTypeCard({
  trainingType,
  customTrainingType,
  customTrainingOptions,
  onTrainingTypeChange,
  onCustomTrainingChange,
  onCustomTrainingOptionsChange,
}: TrainingTypeCardProps) {

  const handleSelect = (option: string) => {
    // Lógica de selección única original
    const newValue = trainingType === option ? "" : option;
    onTrainingTypeChange(newValue);
  }

  const addCustomTraining = () => {
    const trimmed = customTrainingType.trim()
    if (
      trimmed &&
      !TRAINING_OPTIONS.includes(trimmed) &&
      !customTrainingOptions.includes(trimmed)
    ) {
      onCustomTrainingOptionsChange([...customTrainingOptions, trimmed])
      onTrainingTypeChange(trimmed)
      onCustomTrainingChange("")
    }
  }

  return (
    <Card className="bg-white rounded-[20px] gap-2 mb-16 border-1 border-[#DADADA] shadow-none px-4 py-4">
      <h2 className="text-2xl text-[#272830] font-normal mb-0 block">
      Select Additional Products to Maximize Your Content Creation
      </h2>
      <p className="text-sm text-gray-600">
        {"Extend your video's reach with these complementary content packages. Each product uses your video content to create additional marketing assets—all generated from the same inputs you've already provided."}
      </p>

      <div className="flex flex-wrap gap-3 mb-4 mt-4">
        {[...TRAINING_OPTIONS, ...customTrainingOptions].map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => handleSelect(option)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
              trainingType === option
                ? "bg-[#E8F4FD] text-[#1E88E5] border border-[#1E88E5]"
                : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 max-w-md">
        <div className="relative flex-1">
          <Input
            value={customTrainingType}
            onChange={(e) => onCustomTrainingChange(e.target.value)}
            placeholder="Other: Please specify other training type"
            className="pr-10 bg-white"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                addCustomTraining()
              }
            }}
          />
          <button
            type="button"
            onClick={addCustomTraining}
            disabled={!customTrainingType.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Card>
  )
}