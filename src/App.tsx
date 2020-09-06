import React, { useState } from "react";
import { Button, Container, Typography } from "@material-ui/core";
import "./App.css";
import { fetchRandomResult, reduceResult, submitResult } from "./utils/utils";

const App = () => {
  const [isSuccess, setIsSuccess] = useState<boolean | undefined>(undefined);

  const run = async () => {
    const results = await fetchRandomResult();
    console.log("Random Data", results);

    const token = results.data.token;

    const sum: Array<number> = reduceResult(results.data.points);
    console.log("Calculated result", sum);

    const response = await submitResult(token, sum);
    setIsSuccess(response.data.success);
  };

  return (
    <Container>
      <Typography className={isSuccess ? "ok" : "fail"}>
        Result: {isSuccess ? "ok" : "fail"}
      </Typography>
      <Button onClick={run} className={"centerButton"}>
        Run calculation
      </Button>
    </Container>
  );
};

export default App;
