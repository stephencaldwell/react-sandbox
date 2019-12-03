import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import { useLoading, useLoadingTimeout } from "./useLoading";
import { string } from "prop-types";

const App: React.FC = () => {
  const [peopleStateTimeout, setPeopleStateTimeout] = useState<
    { name: string }[]
  >([]);
  const [peopleState, setPeopleState] = useState<{ name: string }[]>([]);

  const [isLoadingPeopleTimeout, loadPeopleTimeout] = useLoadingTimeout(
    async () => {
      const result = await axios.get("https://swapi.co/api/people");
      setPeopleStateTimeout(s => s.concat(result.data.results));
    }
  );

  const [isLoadingPeople, loadPeople] = useLoading(async () => {
    const result = await axios.get("https://swapi.co/api/people");
    setPeopleState(s => s.concat(result.data.results));
  });

  useEffect(() => {
    loadPeople();
    loadPeopleTimeout();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <div style={{ border: "1px solid white" }}>
          <h1>With Timeout</h1>
          {isLoadingPeopleTimeout ? (
            <h2>Loading...</h2>
          ) : (
            <React.Fragment>
              <ul>
                {peopleStateTimeout.map(people => (
                  <li key={people.name}>{people.name}</li>
                ))}
              </ul>
            </React.Fragment>
          )}
        </div>
        <div style={{ border: "1px solid white" }}>
          <h1>Without Timeout</h1>
          {isLoadingPeople ? (
            <h2>Loading...</h2>
          ) : (
            <React.Fragment>
              <ul>
                {peopleState.map(people => (
                  <li key={people.name}>{people.name}</li>
                ))}
              </ul>
            </React.Fragment>
          )}
        </div>
      </header>
    </div>
  );
};

export default App;
