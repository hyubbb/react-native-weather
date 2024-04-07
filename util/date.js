const date = (props) => {
  // const timestamp = Date.now();
  const timestamp = props;
  const offset = 9 * 60 * 60 * 1000;
  const date = new Date(timestamp * 1000 + offset);
  const sliceDate = date.toISOString().slice(0, 10);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const week = date.getDay();
  const WEEKDAY = [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ];

  // if (!props) {
  //   sliceDate = date.toISOString().slice(0, 10);
  //   month = date.getMonth() + 1;
  //   day = date.getDate() - 1;
  // } else {
  //   sliceDate = props.slice(0, 10);
  //   splitDate = sliceDate.split("-");
  //   month = splitDate[1];
  //   day = splitDate[2];
  // }
  const koDate = `${+month}월 ${+day}일`;
  return { date: sliceDate, koDate, weekday: WEEKDAY[week] };
};

export default date;
