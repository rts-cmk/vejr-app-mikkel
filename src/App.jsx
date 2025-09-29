export default function App() {
  return (
    <main className="container">
      <div className="weather-card">
        <header className="weather-header">
          <h1 className="weather-city">
            Copenhagen
          </h1>
        </header>
        
        <section className="weather-temperature">
          -8°
        </section>
        
        <div className="weather-icon-container">
          <img
            className="weather-icon"
            src="https://openweathermap.org/img/wn/02n@2x.png"
            alt="weather icon night cloudy"
            tabIndex={0}
          />
        </div>
        
        <div className="weather-description">
          <span className="weather-description-title">
            Partly Cloudy
          </span>
          <span className="weather-description-temperature">
            H: -3°  L: -8°
          </span>
        </div>
      </div>
    </main>
  )
}