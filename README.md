# 🌦️ Weather App

A modern and fast web app that allows users to search for weather forecasts by **city** or **current location**. Built with **React**, **TypeScript**, and **Tailwind CSS**, it features **real-time updates every minute**, **detailed weather data** (temperature, humidity, wind, pressure), and a **smart search history** for quick access to recent searches.

Deployed application: [Forecast App](https://weather-forecast-app-eosin.vercel.app)

## ✨ Features

### 🔍 Smart Search

- Search weather by **city name** or **geolocation** (using browser permissions).
- Provides **autocomplete** suggestions and saves recent searches.
- Works even after refresh thanks to **localStorage persistence**.

### 🕓 Weather Forecast

- Displays **current temperature**, **humidity**, **wind**, and **pressure**.
- Includes **detailed descriptions** and **dynamic weather icons**.
- Keeps data **fresh automatically** by **refetching every 1 minute** to ensure up-to-date weather information.

### 🕰 Search History

- Automatically stores search results in **localStorage**.
- Allows **deleting** items and **undoing** deletions (session-based).
- Shows **timestamp** for each search with formatted local time.
- Displays a friendly message when history is empty.

### ⚡ Performance & UX

- Uses **skeleton loaders** for smooth transitions during fetches.
- Built with a responsive grid layout supporting both desktop and mobile.
- Weather info and search history are rendered in a **clean two-column layout**.
- Grid adjusts dynamically but maintains consistent sizing for long names.

### 🧠 Local Storage Handling

- Local history is stored persistently.
- Recently removed items are kept in **sessionStorage** for multiple undo actions.
- Includes a clear separation of concerns with `HistoryService` utility.

### 🪄 Undo System

- Each removal is reversible until session ends.
- Undo button visibility dynamically updates based on availability.
- Restores items to their **original position** in the list.

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- OpenWeatherMap API key (free signup at [openweathermap.org](https://openweathermap.org/api))

## 🚀 Getting Started

- ### 1️⃣ Clone the repository

  ```bash
  git clone https://github.com/yarslvd/weather-forecast-app.git
  cd where-weather-app
  ```

- ### 2️⃣ Install dependencies

  ```bash
  npm install
  ```

- ### 3️⃣ Environment Variables

  Copy the example .env file and set your OpenWeather API key:

  ```bash
  cp .env.example .env
  ```

  Edit .env:

  `VITE_OPENWEATHER_API_KEY`

  > Replace your_api_key_here with your own OpenWeather API key.

- ### 4️⃣ Run the app

  ```bash
  npm run dev
  ```

  Then open http://localhost:5173
  in your browser.

- ### 5️⃣ Build for production

  ```bash
  npm run build
  ```

- ### 6️⃣ Preview production build
  ```bash
  npm run preview
  ```
  Then open http://localhost:4173
  in your browser.

## 🧩 Project Structure

```
src/
├── api/ # API setup
├── components/ # Reusable UI components
├── config/ # App configuration and environment settings
├── constants/ # Global constants (e.g., weather units, errors)
├── features/ # Feature modules (WeatherInfo, SearchHistory, SearchInput)
├── hooks/ # Custom React hooks (useWeatherForecast, useSearchHistory, useCitySuggestions)
├── lib/ # Utility functions (formatters, helpers)
├── services/ # Business logic and data handling (e.g., WeatherService, HistoryService)
├── tests/ # Tests (Vitest + React Testing Library)
├── types/ # Shared TypeScript types and interfaces
└── App.tsx # Main layout and entry point
```

## 🛠️ Scripts

- `npm run dev` – Starts the development server using **Vite**.
- `npm run build` – Compiles TypeScript (`tsc`) and builds the production-ready app with **Vite**.
- `npm run lint` – Runs **ESLint** on all JS/TS/JSX/TSX files and reports any issues.
- `npm run lint:fix` – Runs ESLint and automatically fixes fixable problems.
- `npm run test` – Runs unit and integration tests with **Vitest**.
- `npm run test:watch` – Runs tests in watch mode for continuous testing during development.
- `npm run test:ui` – Launches the **Vitest UI** for interactive test results.
- `npm run preview` – Previews the production build locally using **Vite Preview**.

## 🧪 Testing

This project uses **Vitest** and **React Testing Library** for testing.

### Testing components

- **WeatherInfo** – loading states and weather data rendering
- **SearchHistory** – managing recent searches and undo functionality
- **HistoryService** – local and session storage logic
- **WeatherForecastService** – fetching and processing weather data from the API

### Useful Test Scripts:

- `npm run test` – Run all tests once.
- `npm run test:watch` – Run tests in watch mode during development.
- `npm run test:ui` – Launch the Vitest interactive UI for test results.

## ⚙️ Tech Stack

- **React 18** + **TypeScript**
- **Tailwind CSS** for UI styling
- **Lucide Icons** for visuals
- **shadcn/ui** for ready-to-use UI components
- **OpenWeather API** for weather data
