import { Card, CardContent, Typography } from "@material-ui/core";
import "./InfoBox.css";
import React, { useState, useEffect } from "react";
import CountUp from "react-countup";

const Infobox = ({ isRed, title, cases, active, total, ...props }) => {
  const [caseCount, setCaseCount] = useState(0);

  useEffect(() => {
    setCaseCount(parseFloat(cases));
  }, [cases]);

  return (
    <Card
      onClick={props.onClick}
      className={`infobox ${active && "infobox--selected"} ${
        isRed && "infobox--red"
      }`}
    >
      <CardContent>
        <Typography className="infobox_title" color="textSecondary">
          {title}
        </Typography>
        <h2 className={`infobox_cases ${!isRed && "infobox_cases--green"}`}>
          <CountUp suffix="k" end={caseCount} decimals={1} decimal="," />
        </h2>
        <Typography className="infobox_total" color="textSecondary">
          {total} Total
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Infobox;
