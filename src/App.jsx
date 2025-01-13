import './App.css'

// Images
import searchIcon  from './assets/search.svg'
import clearIcon  from './assets/clear.svg'
import cloudIcon  from './assets/cloud.svg'
import drizzleIcon  from './assets/drizzle.png'
import rainIcon  from './assets/rain.svg'
import windIcon  from './assets/wind.png'
import snowIcon  from './assets/snow.svg'
import humidityIcon  from './assets/humidity.png'
import { useEffect, useState } from 'react'

const WeatherDeatails = ({icon, temp, city, country, lat, lon, humidity, wind}) => {
  return (
    <>
      <div className='image'>
        <img src={icon} alt="Clear" />
      </div>
      <div className='temp'>
      {temp}°C</div>
      <div className='location'>{city}</div>
      <div className='country'>{country}</div>
      <div className='cord'>
        <div>
          <span className='lat'>Latitude</span>
          <span>{lat}</span>
        </div>
        <div>
          <span className='lon'>Longitude</span>
          <span>{lon}</span>
        </div>
      </div>
      <div className="data-container">

        {/* Humidity */}
        <div className="element">
          <img src={humidityIcon} alt="Humidity" className='icon' />
          <div className='data'>
            <div className="humidity-percent">{humidity}%</div>
            <div className="text">Humidity</div>
          </div>
        </div>
        
        {/* Wind */}
        <div className="element">
          <img src={windIcon} alt="Wind" className='icon' />
          <div className='data'>
            <div className="wind-percent">{wind} km/h</div>
            <div className="text">Wind Speed</div>
          </div>
        </div>

      </div>
    </>
  ) 
}

function App() {

  let api = "332877a044c7c32509d2555656adc83f"

  const [icon, setIcon] = useState(snowIcon)
  const [temp, setTemp] = useState(0)
  const [city, setCity] = useState("")
  const [country, setCountry] = useState("")
  const [lat, setLat] = useState(0)
  const [lon, setLon] = useState(0)
  const [humidity, setHumidity] = useState(0)
  const [wind, setWind] = useState(0)

  const [text, setText] = useState("Tiruvannamalai")
  const [cityNotFound, setCityNotFound] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // https://openweathermap.org/weather-conditions
  const weatherIcons = {
    "01d": clearIcon,
    "01n": clearIcon,
    "02d": cloudIcon,
    "02n": cloudIcon,
    "03d": drizzleIcon,
    "03n": drizzleIcon,
    "04d": drizzleIcon,
    "04n": drizzleIcon,
    "09d": rainIcon,
    "09n": rainIcon,
    "10d": rainIcon,
    "10n": rainIcon,
    "13d": snowIcon,
    "13n": snowIcon
  }

  const search = async () => {

    setLoading(true)

    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api}&units=Metric`

    try{
      let res = await fetch(url)
      let data = await res.json()
      // console.log(data)
      if(data.cod === "404"){
        console.error("City not found")
        setCityNotFound(true)
        setLoading(false)
        return;
      }

      setHumidity(data.main.humidity)
      setWind(data.wind.speed)
      setTemp(Math.floor(data.main.temp))
      setCity(data.name)
      setCountry(data.sys.country)
      setLat(data.coord.lat)
      setLon(data.coord.lon)

      const weatherIconCode = data.weather[0].icon
      setIcon(weatherIcons[weatherIconCode] || clearIcon)

      setCityNotFound(false)

    }catch (error){

      console.error("An error occured: ", error)
      setError("An error occured while fetching weather data.")

    }finally{

      setLoading(false)
      
    }

  }

  const handleCity = (e) => {
    setText(e.target.value)
  }

  const handleKey = (e) => {
    if (e.key == "Enter"){
      search()
    }
  }

  useEffect(function () {
    search()
  }, [])

  return (
    <>
      <div className='container'>
        <div className='input-container'>
          <input type="text" className='cityInput' placeholder='Search City' onChange={handleCity} value={text} onKeyDown={handleKey}/>
          <div className='searchIcon' onClick={() => {search()}}>
            <img src={searchIcon} alt="Search" />
          </div>
        </div>

        {loading && <div className="loading-message">Loading...</div>}
        {error &&  <div className="error-message">{error}</div>}
        {cityNotFound && <div className="city-not-found">City not found!</div>}

        {!loading && !cityNotFound && <WeatherDeatails icon={icon} temp={temp} city={city} country={country} lat={lat} lon={lon} humidity={humidity} wind={wind}/>}

        <p className="copyright">Designed by <span>Surya</span></p>
      </div>
    </>
  )
}

export default App