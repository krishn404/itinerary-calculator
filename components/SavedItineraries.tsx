"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { openDB } from "idb"

interface Itinerary {
  id: number
  date: Date
  services: Array<{ name: string; price: number }>
  totalCost: number
}

const SavedItineraries: React.FC = () => {
  const [itineraries, setItineraries] = useState<Itinerary[]>([])

  useEffect(() => {
    const loadItineraries = async () => {
      const db = await openDB("itinerary-calculator", 1)
      const storedItineraries = await db.getAll("itineraries")
      setItineraries(storedItineraries)
    }

    loadItineraries()
  }, [])

  const handleDelete = async (id: number) => {
    const db = await openDB("itinerary-calculator", 1)
    await db.delete("itineraries", id)
    setItineraries(itineraries.filter((itinerary) => itinerary.id !== id))
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Saved Itineraries</h2>
      {itineraries.length === 0 ? (
        <p>No saved itineraries yet.</p>
      ) : (
        <ul className="space-y-4">
          {itineraries.map((itinerary) => (
            <li key={itinerary.id} className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Itinerary from {new Date(itinerary.date).toLocaleDateString()}
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Total Cost: ${itinerary.totalCost}</p>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                <dl className="sm:divide-y sm:divide-gray-200">
                  {itinerary.services.map((service, index) => (
                    <div key={index} className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">{service.name}</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">${service.price}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button
                  onClick={() => handleDelete(itinerary.id)}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default SavedItineraries

