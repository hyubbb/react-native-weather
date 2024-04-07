// api 유료버전, today데이터 따로 추출하기전

import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import * as Location from "expo-location";
import handlerDate from "./util/date";
import { Ionicons } from "@expo/vector-icons";
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const API_KEY = "33b109a878114628aac83697a2d91b0f";

const icons = {
  Clear: "sunny",
  Clouds: "cloudy",
  Rain: "rain",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Drizzle: "day-rain",
  Thunderstorm: "lightning",
};

export default function App() {
  const [city, setCity] = useState("...loading");
  const [ok, setOk] = useState(true);

  const [days, setDays] = useState([]);
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
  };

  const setCurrentDate = async ({ latitude, longitude }) => {
    const response = await fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=kr`
    );

    const data = await response.json();
    const { daily, current } = data;
    const { dt: todayDate, weather: todayWeather, temp } = current;
    const currentDateTime = handlerDate(todayDate).date;
    const todayTemp = daily[0].temp;
    setToday({ temp: todayTemp, date: currentDateTime });
    setDays(daily);
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
          {days.length === 0 ? (
            <View style={styles.day}>
              <ActivityIndicator />
            </View>
          ) : (
            <>
              {days.map((day, idx) => {
                const { weather, dt, temp, maxTemp } = day;
                const { main, description } = weather[0];
                const { koDate, weekday } = handlerDate(dt);
                return (
                  <View key={idx} style={styles.day}>
                    <View style={styles.dateBox}>
                      <Text style={styles.date}>{koDate}</Text>
                      <Text style={styles.date}>{weekday}</Text>
                    </View>
                    <View>
                      <Ionicons
                        name={icons[main]}
                        size={40}
                        style={styles.icon}
                        color='#fff'
                      />
                      <Text style={styles.temp}>
                        {idx === 0
                          ? parseFloat(today.temp.day).toFixed(1)
                          : parseFloat(temp.day).toFixed(1)}
                      </Text>
                    </View>
                    {/* <Text style={styles.tinyText}></Text> */}

                    <Text style={styles.description}>{description}</Text>
                    <View style={styles.maxminTempBox}>
                      <Text style={styles.maxminTemp}>
                        {" " + parseFloat(temp.max).toFixed(1)}°/
                        {" " + parseFloat(temp.min).toFixed(1)}°
                      </Text>
                    </View>
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
    gap: 30,
  },
  city: {
    flex: 0.3,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  cityName: {
    fontSize: 30,
    fontWeight: "600",
    color: "#fff",
  },
  dateBox: {
    width: SCREEN_WIDTH,
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  date: { fontSize: 20, color: "#fff", width: "100", color: "#757575" },
  day: { width: SCREEN_WIDTH, alignItems: "center" },
  temp: { fontSize: 120, color: "#fff" },
  description: { fontSize: 30, color: "#fff" },
  descriptionBox: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  maxminTempBox: {
    width: SCREEN_WIDTH,
    alignItems: "flex-end",
  },
  maxminTemp: {
    fontSize: 20,
    marginRight: 30,
    color: "#fff",
  },
});
