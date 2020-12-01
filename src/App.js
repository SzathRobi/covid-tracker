import {
  Card,
  CardContent,
  FormControl,
  MenuItem,
  Select
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import Infobox from "./comps/Infobox";
import LineGraph from "./comps/LineGraph";
import CovidMap from "./comps/CovidMap";
import Table from "./comps/Table/Table";
import "./styles.css";
import { prettyPrintStat, sortData } from "./util";
import "leaflet/dist/leaflet.css";

export default function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 25, lng: -15.4796 });
  const [mapZoom, setMapZoom] = useState(1.5);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [isLoaded, setIsLoaded] = useState(false);

  const getInitialworldwide = async () => {
    const response = await fetch("https://disease.sh/v3/covid-19/all");
    const data = await response.json();
    setCountryInfo(data);
  };

  useEffect(() => {
    getInitialworldwide();
  }, []);

  const getCountriesData = async () => {
    const response = await fetch("https://disease.sh/v3/covid-19/countries");
    const data = await response.json();
    const countries = await data.map((country) => ({
      name: country.country,
      value: country.countryInfo.iso2
    }));
    const sortedData = sortData(data);
    setCountries(countries);
    setMapCountries(data);
    setTableData(sortedData);
  };

  useEffect(() => {
    getCountriesData();
  }, []);

  const countryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    const response = await fetch(url);
    const data = await response.json();
    setCountry(countryCode);
    setCountryInfo(data);
    // setMapCenter([country.countryInfo.lat, country.countryInfo.long]);
    // setMapZoom(4);
  };

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="app">
      <div className="app_left">
        <div className="app_header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl>
            <Select
              className="select"
              variant="outlined"
              value={country}
              onChange={countryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem key={country.value} value={country.value}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app_stats">
          <Infobox
            isRed
            active={casesType === "cases"}
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus Cases"
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}
          />
          <Infobox
            active={casesType === "recovered"}
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}
          />
          <Infobox
            isRed
            active={casesType === "deaths"}
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}
          />
        </div>

        <CovidMap
          countries={mapCountries}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
      <Card className="app_right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          <h3>Worldwide Live {casesType}</h3>
          <LineGraph casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}
