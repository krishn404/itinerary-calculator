import type React from "react"

interface HomePageProps {
  setActiveTab: (tab: string) => void
}

const HomePage: React.FC<HomePageProps> = ({ setActiveTab }) => {
  return (
    <div className="text-center max-w-2xl mx-auto py-12">
      <h2 className="text-4xl font-bold text-gray-900 mb-6">
        Welcome to Itinerary Calculator
      </h2>
      <p className="text-lg text-gray-600 mb-8">
        Create and manage your travel itineraries with ease. Plan your trips, calculate costs, and keep everything organized in one place.
      </p>
      <button
        onClick={() => setActiveTab("calculator")}
        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
      >
        <span>Create New Itinerary</span>
        <svg className="ml-2 -mr-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </button>
    </div>
  )
}

export default HomePage

