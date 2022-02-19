import "./App.css";
import {
  Card,
  CardContent,
  FormControl,
  MenuItem,
  Select,
  Table,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Tables from "./Table";
import { prettyPrintStat, sortData } from "./util";
import LineGraph from "./LineGraph";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./InfoBox.css";
function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  // while app.js get loads it execute ie. for adding []
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all") // while page refresh world wide cases, recovered , deaths will be displayed
      .then((response) => response.json())
      .then((data) => setCountryInfo(data));
  }, []);

  // USEEFFECT - Runs a piece of code (takes a function ) based on given condition
  useEffect(() => {
    // async -> send a request , wait for it, do something with it
    const getCountriesData = async () => {
      fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          let sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        });
    };
    getCountriesData(); // async point
    // The code inside will runs once while the component loads not again
  }, []); // [countries ] whenenver the data inside [] will change the function inside will run

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    console.log("country code=", countryCode);
    setCountry(countryCode);
    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };

  console.log("countryinfo=", countryInfo);
  return (
    <div className="App">
      <div className="app_left">
        <div className="app_header">
          <h1> Covid 19 Tracker </h1>{" "}
          <FormControl className="app_dropdown">
            <Select
              variant="outlined"
              onChange={onCountryChange}
              value={country}
            >
              <MenuItem value="worldwide"> worldwide </MenuItem>{" "}
              {/* Loop through all the countries & show dropdown option */}{" "}
              {countries.map((country) => (
                <MenuItem value={country.value}> {country.name} </MenuItem>
              ))}{" "}
              {/* <MenuItem value='world wide'>world wide</MenuItem>
                              <MenuItem value='world wide'>Option One</MenuItem>
                              <MenuItem value='world wide'>Option two</MenuItem> */}{" "}
            </Select>{" "}
          </FormControl>{" "}
        </div>{" "}
        <div className="app_stats">
          <InfoBox
            isRed
            active = { casesType  === 'cases'}
            onClick={(e) => setCasesType("cases")}
            title="Corona Virus Cases"
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}
          ></InfoBox>{" "}
          <InfoBox
            active = { casesType  === 'recovered'}          
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recover)}
          >
            {" "}
          </InfoBox>{" "}
          <InfoBox
            active = { casesType  === 'deaths'}
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}
          >
            {" "}
          </InfoBox>{" "}
        </div>{" "}
        <Map 
            casesType={casesType}
            countries={mapCountries} 
            center={mapCenter} 
            zoom={mapZoom} />
      </div>{" "}
      <Card className="app_right">
        <CardContent>
          <h3> live cases by country </h3>
          <Tables countries={tableData} />
          <h3> world wide new {casesType} </h3> 
          <LineGraph casesType={casesType}/>
        </CardContent>{" "}
      </Card>{" "}
    </div>
  );
}

export default App;
