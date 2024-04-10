// api 무료버전
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { AntDesign } from "@expo/vector-icons";
import * as Location from "expo-location";
import handlerDate from "./util/date";
import { Ionicons } from "@expo/vector-icons";
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const API_KEY = "33b109a878114628aac83697a2d91b0f";

const icons = {
  온흐림: "cloudy",
  맑음: "sunny",
};

export default function App() {
  const { date: todayDate, koDate } = handlerDate();
  const [city, setCity] = useState("...loading");
  const [ok, setOk] = useState(true);
  const [today, setToday] = useState([]);
  const [forecastDays, setForecastDays] = useState([]);
  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync(
      {
        latitude,
        longitude,
      },
      { useGoogleMaps: false }
    );
    setCity(location[0].city);
    const currWeather = await setCurrentDate({
      latitude,
      longitude,
    });
    const forecastWeather = await setForecastDate({
      latitude,
      longitude,
    });
  };

  const setCurrentDate = async ({ latitude, longitude }) => {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=kr`
    );
    const data = await response.json();
    const { main, weather } = data;
    setToday({ main, weather: weather[0] });
    return { main, weather: weather[0] };
  };

  const setForecastDate = async ({ latitude, longitude }) => {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&exclude=alerts&lang=kr`
    );
    const data = await response.json();
    const { list: forecastData } = data;
    const sumData = forecastData.reduce((acc, curr) => {
      const date = curr.dt_txt.slice(0, 10);
      const { description, main } = curr.weather[0];
      const { temp, temp_max, temp_min } = curr.main;
      // if (date > todayDate) {
      if (!acc[date]) {
        acc[date] = {
          timestamp: [],
          temps: [],
          main: [],
          temp_maxs: [],
          temp_mins: [],
          descriptions: [],
        };
      }

      acc[date].main.push(main);
      acc[date].temps.push(temp);
      acc[date].temp_maxs.push(temp_max);
      acc[date].temp_mins.push(temp_min);
      acc[date].descriptions.push(description);
      acc[date].timestamp.push(curr.dt_txt);
      // }
      return acc;
    }, {});

    const processedData = Object.keys(sumData).map((date) => {
      let maxCnt = 0;
      let maxWeather = "";
      const { temp_maxs, temp_mins, descriptions, temps, timestamp, main } =
        sumData[date];
      const averageTemp =
        temps.reduce((sum, val) => sum + val, 0) / temps.length;
      const maxTemp = Math.max(...temp_maxs);
      const minTemp = Math.min(...temp_mins);
      const descCnt = Object.values(descriptions).reduce((acc, curr) => {
        acc[curr] = (acc[curr] || 0) + 1;
        return acc;
      }, {});
      Object.entries(descCnt).forEach(([weather, count]) => {
        if (count > maxCnt) {
          maxCnt = count;
          maxWeather = weather;
          // maxMain =
        }
      });
      return {
        date,
        main,
        temp: parseFloat(averageTemp).toFixed(1),
        maxTemp: parseFloat(maxTemp).toFixed(1),
        minTemp: parseFloat(minTemp).toFixed(1),
        timestamp: timestamp[0],
        description: maxWeather,
      };
    });
    setForecastDays(processedData);
  };

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.city}>
          <Text style={styles.cityName}>{city}</Text>
        </View>
        <ScrollView
          contentContainerStyle={styles.weather}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator='false'
        >
          {today.length === 0 ? (
            <View style={styles.day}>
              <ActivityIndicator />
            </View>
          ) : (
            <>
              <View style={styles.day}>
                <Text style={styles.date}>{koDate}</Text>
                <View
                  style={{
                    alignItems: "center",
                    flexDirection: "row",
                    width: "100%",
                  }}
                >
                  <Text style={styles.temp}>
                    {parseFloat(today.main.temp).toFixed(1)}
                  </Text>
                  <Ionicons name='cloudy' size={80} color='#fff' />
                </View>
                <Text style={styles.description}>
                  {today.weather.description}
                </Text>
                {/* <Text style={styles.tinyText}>{today.weather.description}</Text> */}
              </View>
              {forecastDays.map((forecastDay, idx) => {
                return (
                  <View key={idx} style={styles.day}>
                    <Text style={styles.date}>
                      {handlerDate(forecastDay.timestamp).koDate}
                    </Text>
                    <Text style={styles.temp}>{forecastDay.temp}</Text>
                    <Text style={styles.description}></Text>
                    <Text style={styles.tinyText}>
                      {forecastDay.description}
                    </Text>
                    <Ionicons
                      name={icons[forecastDay.description]}
                      size={24}
                      color='#fff'
                    />

                    <Text style={styles.tinyText}>{forecastDay.maxTemp}</Text>
                    <Text style={styles.tinyText}>{forecastDay.minTemp}</Text>
                  </View>
                );
              })}
            </>
          )}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#393b3a",
  },
  city: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 48,
    fontWeight: "600",
    color: "#fff",
  },
  day: { alignItems: "center", width: SCREEN_WIDTH },
  date: { fontSize: 40, color: "#fff" },
  temp: { marginLeft: 30, fontSize: 100, color: "#fff" },
  description: { fontSize: 30, color: "#fff" },
  tinyText: { fontSize: 30, color: "#fff" },
});
