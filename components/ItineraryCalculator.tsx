"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { openDB } from "idb"
import { jsPDF } from "jspdf"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface Price {
  [key: string]: number
}

interface Service {
  id: string
  category: string
  name: string
  prices: Price
}

const sampleData: Service[] = [
  // Transportation
  { id: "1", category: "Transportation", name: "DMK – BANGKOK HOTEL", prices: { CAR: 0, SUV: 0, VAN: 0 } },
  { id: "2", category: "Transportation", name: "BANGKOK HOTEL- DMK", prices: { CAR: 0, SUV: 0, VAN: 0 } },
  { id: "3", category: "Transportation", name: "BANGKOK AIRPORT – BANGKOK HOTEL", prices: { CAR: 0, SUV: 0, VAN: 0 } },
  { id: "4", category: "Transportation", name: "BANGKOK AIRPORT - PATTAYA HOTEL", prices: { CAR: 0, SUV: 0, VAN: 0 } },
  { id: "5", category: "Transportation", name: "BANGKOK HOTEL - PATTAYA HOTEL", prices: { CAR: 0, SUV: 0, VAN: 0 } },
  { id: "6", category: "Transportation", name: "PATTAYA HOTEL TO DMK AIRPORT", prices: { CAR: 0, SUV: 0, VAN: 0 } },
  { id: "7", category: "Transportation", name: "PATTAYA HOTEL – BANGKOK AIRPORT", prices: { CAR: 0, SUV: 0, VAN: 0 } },
  { id: "8", category: "Transportation", name: "BANGKOK HOTEL TO BANGKOK AIRPORT", prices: { CAR: 0, SUV: 0, VAN: 0 } },
  { id: "9", category: "Transportation", name: "PHUKET AIRPORT TO KRABI HOTEL", prices: { CAR: 0, SUV: 0, VAN: 0 } },
  { id: "10", category: "Transportation", name: "KRABI HOTEL TO PHUKET HOTEL", prices: { CAR: 0, SUV: 0, VAN: 0 } },
  { id: "11", category: "Transportation", name: "PHUKET HOTEL TO PHUKET AIRPORT", prices: { CAR: 0, SUV: 0, VAN: 0 } },

  // Pattaya Sightseeing (Private)
  {
    id: "12",
    category: "Pattaya Sightseeing (Private)",
    name: "ALCAZAR",
    prices: { "TICKET ADULT": 0, "TICKET CHILD": 0, CAR: 0, VAN: 0 },
  },
  {
    id: "13",
    category: "Pattaya Sightseeing (Private)",
    name: "NOONG NOOCH VILLAGE",
    prices: { "TICKET ADULT": 0, "TICKET CHILD": 0, CAR: 0, VAN: 0 },
  },
  {
    id: "14",
    category: "Pattaya Sightseeing (Private)",
    name: "TIGER PARK",
    prices: { "TICKET ADULT": 0, "TICKET CHILD": 0, CAR: 0, VAN: 0 },
  },

  // Pattaya Sightsee (SIC)
  { id: "15", category: "Pattaya Sightsee (SIC)", name: "CORAL ISLAND", prices: { ADULT: 0, CHILD: 0 } },

  // Bangkok Sightsee (SIC)
  {
    id: "16",
    category: "Bangkok Sightsee (SIC)",
    name: "SAFARI WORLD AN MARINE PARK WITH LUNCH",
    prices: { ADULT: 0, CHILD: 0 },
  },

  // Bangkok Sightseeing (Private)
  {
    id: "17",
    category: "Bangkok Sightseeing (Private)",
    name: "SAFARI WORLD AN MARINE PARK WITH LUNCH",
    prices: { "TICKET ADULT": 0, "TICKET CHILD": 0, CAR: 0, VAN: 0 },
  },

  // Phuket Sightseeing (Private)
  {
    id: "18",
    category: "Phuket Sightseeing (Private)",
    name: "HALF DAY CITY TOUR",
    prices: { "TICKET ADULT": 0, "TICKET CHILD": 0, CAR: 0, VAN: 0 },
  },
  {
    id: "19",
    category: "Phuket Sightseeing (Private)",
    name: "TIGER PARK",
    prices: { "TICKET ADULT": 0, "TICKET CHILD": 0, CAR: 0, VAN: 0 },
  },

  // Phuket Sightsee (SIC)
  { id: "20", category: "Phuket Sightsee (SIC)", name: "HALF DAY CITY TOUR", prices: { ADULT: 0, CHILD: 0 } },

  // Krabi Sightsee (SIC)
  { id: "21", category: "Krabi Sightsee (SIC)", name: "04 ISLAND", prices: { ADULT: 0, CHILD: 0 } },

  // Krabi Sightseeing (Private)
  {
    id: "22",
    category: "Krabi Sightseeing (Private)",
    name: "04 ISLAND",
    prices: { "TICKET ADULT": 0, "TICKET CHILD": 0, CAR: 0, VAN: 0 },
  },
]

const ItineraryCalculator: React.FC = () => {
  const [services, setServices] = useState<Service[]>(sampleData)
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [totalCost, setTotalCost] = useState(0)

  useEffect(() => {
    const initDB = async () => {
      try {
        const db = await openDB("itinerary-calculator", 1, {
          upgrade(db) {
            // Create stores if they don't exist
            if (!db.objectStoreNames.contains("services")) {
              const serviceStore = db.createObjectStore("services", { keyPath: "id" });
              // Populate with initial data during upgrade
              sampleData.forEach(service => {
                serviceStore.put(service);
              });
            }
            if (!db.objectStoreNames.contains("itineraries")) {
              db.createObjectStore("itineraries", { keyPath: "id", autoIncrement: true });
            }
          },
        });

        // After upgrade is complete, get the services
        const tx = db.transaction("services", "readonly");
        const store = tx.objectStore("services");
        const storedServices = await store.getAll();
        
        if (storedServices.length > 0) {
          setServices(storedServices);
        }
      } catch (error) {
        console.error("Failed to initialize database:", error);
        // Fallback to sample data if database initialization fails
        setServices(sampleData);
      }
    };

    initDB();
  }, []);

  useEffect(() => {
    const newTotalCost = selectedServices.reduce((total, serviceId) => {
      const service = services.find((s) => s.id === serviceId)
      if (service) {
        return total + Object.values(service.prices).reduce((sum, price) => sum + price, 0)
      }
      return total
    }, 0)
    setTotalCost(newTotalCost)
  }, [selectedServices, services])

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId],
    )
  }

  const handlePriceChange = async (serviceId: string, priceKey: string, newPrice: number) => {
    const updatedServices = services.map((service) =>
      service.id === serviceId ? { ...service, prices: { ...service.prices, [priceKey]: newPrice } } : service,
    )
    setServices(updatedServices)

    try {
      const db = await openDB("itinerary-calculator", 1)
      const tx = db.transaction("services", "readwrite")
      const store = tx.objectStore("services")
      await store.put(updatedServices.find((s) => s.id === serviceId))
      await tx.done
    } catch (error) {
      console.error("Failed to update service price:", error)
    }
  }

  const handleSaveItinerary = async () => {
    const db = await openDB("itinerary-calculator", 1)
    const selectedServiceDetails = services.filter((service) => selectedServices.includes(service.id))
    await db.add("itineraries", {
      date: new Date(),
      services: selectedServiceDetails,
      totalCost,
    })

    alert("Itinerary saved successfully!")
  }

  const handleExportPDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.text("Itinerary Summary", 20, 20)

    doc.setFontSize(12)
    let yPosition = 40
    selectedServices.forEach((serviceId) => {
      const service = services.find((s) => s.id === serviceId)
      if (service) {
        doc.text(`${service.name}:`, 20, yPosition)
        yPosition += 10
        Object.entries(service.prices).forEach(([key, value]) => {
          doc.text(`  ${key}: $${value}`, 30, yPosition)
          yPosition += 10
        })
      }
    })

    doc.setFontSize(14)
    doc.text(`Total Cost: $${totalCost.toFixed(2)}`, 20, yPosition + 10)

    doc.save("itinerary.pdf")
  }

  const groupServicesByCategory = () => {
    return services.reduce(
      (groups, service) => {
        if (!groups[service.category]) {
          groups[service.category] = []
        }
        groups[service.category].push(service)
        return groups
      },
      {} as { [key: string]: Service[] },
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Itinerary Calculator</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Select Services</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {Object.entries(groupServicesByCategory()).map(([category, categoryServices]) => (
                <AccordionItem key={category} value={category}>
                  <AccordionTrigger>{category}</AccordionTrigger>
                  <AccordionContent>
                    {categoryServices.map((service) => (
                      <div key={service.id} className="mb-4 p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedServices.includes(service.id)}
                              onChange={() => handleServiceToggle(service.id)}
                              className="mr-2"
                            />
                            <span className="font-medium">{service.name}</span>
                          </label>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(service.prices).map(([priceKey, price]) => (
                            <div key={priceKey} className="flex items-center">
                              <Label className="w-1/2">{priceKey}:</Label>
                              <Input
                                type="number"
                                value={price}
                                onChange={(e) => handlePriceChange(service.id, priceKey, Number(e.target.value))}
                                className="w-1/2"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Itinerary Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedServices.map((serviceId) => {
                const service = services.find((s) => s.id === serviceId)
                if (!service) return null
                return (
                  <div key={serviceId} className="border-b pb-2">
                    <h3 className="font-medium">{service.name}</h3>
                    {Object.entries(service.prices).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span>{key}:</span>
                        <span>${value}</span>
                      </div>
                    ))}
                  </div>
                )
              })}
              <div className="text-xl font-bold">Total Cost: ${totalCost.toFixed(2)}</div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button onClick={handleSaveItinerary}>Save Itinerary</Button>
            <Button onClick={handleExportPDF} variant="outline">
              Export PDF
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default ItineraryCalculator

