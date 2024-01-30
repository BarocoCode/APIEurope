import React, { useState } from "react"
import { useQuery } from "@tanstack/react-query"

import "./App.css"

const API_URL = "https://restcountries.com/v3.1/region/europe"

interface CountryData {
  name: string
  capital: string
  region: string
  subregion: string
  languages: string
  borders: string[]
  population: number
  continents: string
}

const fetchCountryData = async (
  page: number,
  perPage: number
): Promise<CountryData[]> => {
  try {
    const response = await fetch(API_URL)

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()

    if (!data || !Array.isArray(data)) {
      return []
    }

    const startIndex = (page - 1) * perPage
    const endIndex = startIndex + perPage
    const slicedData = data.slice(startIndex, endIndex)

    return slicedData.map((countryData) => ({
      name: countryData.name.common,
      capital: countryData.capital,
      region: countryData.region,
      borders: countryData.borders || [],
      subregion: countryData.subregion,
      languages: Object.values(countryData.languages).join(", "),
      population: countryData.population,
      continents: countryData.continents,
    }))
  } catch (error) {
    console.error("Error fetching country data:", error)
    return []
  }
}

export default function App() {
  const [page, setPage] = useState(1)
  const pageChange = (newPage: number) => {
    setPage(newPage)
  }

  const {
    data: country,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["/countries", page],
    queryFn: () => fetchCountryData(page, 10),
  })

  if (isLoading) {
    return <React.Fragment>Loading...</React.Fragment>
  }

  if (isError || !country?.length) {
    return (
      <React.Fragment>
        <p className="error">Something is wrong or Data is not available.</p>
        <p className="error">Please try again Soon!</p>
      </React.Fragment>
    )
  }

  return (
    <section className="primaryContainer">
      <h1 className="title">Country in E.U</h1>
      {country.map((country, index) => (
        <div className="countryContainer" key={index}>
          <React.Fragment>
            <h3 className="titleCountry">Details of Country: </h3>
            <p>Name: {country.name}</p>
            <p>Capital City: {country.capital}</p>
            <p>Language: {country.languages}</p>
            <p>Total Population: {country.population}</p>
            <p>Borders: {country.borders.join(" , ")}</p>
            <p>Continents: {country.continents}</p>
            <p>Region: {country.region}</p>
            <p>Sub Region: {country.subregion}</p>
          </React.Fragment>
        </div>
      ))}
      <div className="pageBtn">
        <React.Fragment>
          <button
            className="btn"
            onClick={() => pageChange(page - 1)}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="page">Page {page}</span>
          <button
            className="btn"
            onClick={() => pageChange(page + 1)}
            disabled={!country.length}
          >
            Next
          </button>
        </React.Fragment>
      </div>
    </section>
  )
}
