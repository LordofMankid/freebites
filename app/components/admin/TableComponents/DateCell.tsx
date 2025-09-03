import React from "react";

interface DateCellProps {
  date: Date;
}
function DateCell(props: DateCellProps) {
  const { date } = props;
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  let hour = date.getHours();
  let ampm = "am";
  if (hour >= 12) {
    ampm = "pm";
    if (hour > 12) hour -= 12;
  } else if (hour === 0) {
    hour = 12;
  }
  const minutes = date.getMinutes().toString().padStart(2, "0");

  const dateString = `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}, ${hour}:${minutes} ${ampm}`;

  return <p className="font-inter text-sm pb-1">{dateString}</p>;
}

export default DateCell;
