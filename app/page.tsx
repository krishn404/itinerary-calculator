"use client"

import { useState } from "react"
import HomePage from "@/components/HomePage"
import ItineraryCalculator from "@/components/ItineraryCalculator"
import SavedItineraries from "@/components/SavedItineraries"

export default function Home() {
  const [activeTab, setActiveTab] = useState("home")

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Itinerary Calculator</h1>

        </div>
      </header>

      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <button
                onClick={() => setActiveTab("home")}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  activeTab === "home"
                    ? "border-indigo-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Home
              </button>
              <button
                onClick={() => setActiveTab("saved")}
                className={`ml-8 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  activeTab === "saved"
                    ? "border-indigo-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Saved Itineraries
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {activeTab === "home" && <HomePage setActiveTab={setActiveTab} />}
        {activeTab === "calculator" && <ItineraryCalculator />}
        {activeTab === "saved" && <SavedItineraries />}
      </main>
    </div>
  )
}

