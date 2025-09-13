// src/components/Header.jsx
import { useState, useEffect } from "react"

function Header() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger animation after mount
    setIsVisible(true)
  }, [])

  return (
    <div className="text-center mb-10">
      <h1
        className={`text-white text-5xl font-bold tracking-wide drop-shadow-lg 
        transform transition-all duration-1000 ease-out
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
      >
        Options Data Retriever
      </h1>
      <h3
        className={`text-gray-300 text-lg mt-3 max-w-xl mx-auto transition-all duration-1000 delay-300 ease-out
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}
      >
        Enter your criteria to fetch relevant options data.
      </h3>
    </div>
  )
}

export default Header
