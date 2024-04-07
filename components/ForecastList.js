import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import handlerDate from "../util/date";

const icons = {
  Clear: "sunny",
  Clouds: "cloudy",
  Rain: "rain",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Drizzle: "day-rain",
  Thunderstorm: "lightning",
};

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const ForecastList = ({ days }) => {
  console.log(days);
  return days.map((day, idx) => {
    const { weather, dt, temp, nowTemp } = day;
    const { main, description } = weather[0];
    const { koDate, weekday } = handlerDate(dt);
    if (idx === 0) return null;
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
  });
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#393b3a",
    gap: 10,
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
  temp: { fontSize: 30, color: "#fff" },
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

export default ForecastList;
