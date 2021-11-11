import React, { useRef, useState, useEffect } from 'react';
import './styling.css'

const LOCAL_STORAGE_KEY = 'myLocalStorageKey';

function App() {
  const [adviceParagraph, setAdvice] = useState();
  const [height, setHeight] = useState();
  const heightInput = useRef();
  const [weight, setWeight] = useState();
  const weightInput = useRef();
  const [sex, setSex] = useState();
  const isMaleInput = useRef();
  const isFemaleInput = useRef();
  const [goal, setGoal] = useState();
  const goalInput = useRef();
  
  /*
  const handleChange = e => {
    const target = e.target;
    if (target.checked) {
      setSex(target.value);
    }
  };
  */

  const handleSubmit = e => {
    e.preventDefault();
    if (height === '' || isNaN(height) || weight === '' || isNaN(weight) || sex === undefined || goal === '' || isNaN(goal)) return
    heightInput.current.value = null;
    weightInput.current.value = null;
    goalInput.current.value = null;
    setAdvice("Your height is " + height + "\nYour weight is " + weight + "\nYour sex is " + sex + ".\nYou are " + (weight - goal) + " lbs away from your goal.")
  };

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([height, weight, sex, goal]));
  });
  
  return (
    <div className="App">
      <div id="header">
        <h1>Reach Your Fitness Goal</h1>
        <p>Just enter some basic information</p>
      </div>

      <form>
        Height: 
        <input ref={heightInput} onChange={(e) => setHeight(e.target.value)} type="text" id="height" name="height" />
      </form>
      <form>
        Weight: 
        <input ref={weightInput} onChange={(e) => setWeight(e.target.value)} type="text" id="weight" name="weight" />
      </form>
      <form>
        <p id="">Sex</p>
        <input ref={isMaleInput} onChange={(e) => setSex(e.target.value)} type="radio" id="maleS" name="sex" value="Male" />
        <label for="maleS">Male</label><br />
        <input ref={isFemaleInput} onChange={(e) => setSex(e.target.value)} type="radio" id="femaleS" name="sex" value="Female" />
        <label for="femaleS">Female</label><br />
      </form>
      <form>
        Weight Goal: 
        <input ref={goalInput} onChange={(e) => setGoal(e.target.value)} type="text" name="goal" /> lbs
      </form>
      <form>
        <input onClick={handleSubmit} type="button" id="execute" value="Get my diet plan" />
      </form>
      <p id="advice">{adviceParagraph}</p>
    </div>
  );
}

export default App;
