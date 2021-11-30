import React, { useRef, useState, useEffect } from 'react';
import './styling.css'
import './normalize.css'

const LOCAL_STORAGE_KEY = 'myLocalStorageKey';

function fetchNutritionData(query) {
  let init = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({"query": query})
  }
  return fetch("https://api.nal.usda.gov/fdc/v1/foods/search?api_key=DEMO_KEY", init)
  .then(res => res.json())
}

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
  const [nutritionQuery, setNutritionQuery] = useState();
  const nutritionInput = useRef();
  const [calories, setCalories] = useState();

  
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
    setAdvice("Your height is " + height + "\nYour weight is " + weight + "\nYour sex is " + sex + ".\nYou are " + (weight - goal) + " lbs away from your goal. Your recommended calories per day is " + calories + " to reach your goal weight in " + Math.ceil(weight/4) + " month(s)"); 
  };

  const handleNutritionSearch = e => {
    e.preventDefault();
    if (nutritionQuery === '') return
    nutritionInput.current.value = null;
    let nutritionHTML = document.getElementById("nutritionData");
    nutritionHTML.innerHTML = "Loading nutrition data...";
    fetchNutritionData(nutritionQuery)
    .then(result => {
      try {
        let nutritionIdMap = {
          1003: "Protein",
          1004: "Total Fat",
          1005: "Total Carbohydrates",
          1008: "Energy",
          2000: "Total Sugars",
          1093: "Sodium",
          1235: "Added Sugar",
          1253: "Cholesterol",
          1258: "Saturated Fat",
        }
        let foodSelection = result.foods[0];
        let nutrientInfo = {"Serving Size": `Serving Size: ${foodSelection.servingSize} ${foodSelection.servingSizeUnit.toLowerCase()}<br>`};
        for (const entry of foodSelection.foodNutrients) {
          let nutrientName = nutritionIdMap[entry.nutrientId];
          nutrientInfo[nutrientName] = `${nutrientName}: ${entry.value} ${entry.unitName.toLowerCase()}<br>`;
        }
        let nutritionDataString = `${nutritionQuery} has the following nutritional content<br>`;
        let nutritionOrder = ["Serving Size", "Energy", "Total Fat", "Saturated Fat", "Cholesterol", "Sodium", "Total Carbohydrates", "Total Sugars", "Added Sugar", "Protein"];
        for (const entry of nutritionOrder) {
          if (nutrientInfo.hasOwnProperty(entry)) {
            nutritionDataString += nutrientInfo[entry];
          }
        }
        nutritionHTML.innerHTML = nutritionDataString;
      } catch (error) {
        console.log(error);
        nutritionHTML.innerHTML = `Oops, couldn't find any food data for the search term "${nutritionQuery}"`;
      }
    })
  }

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
        Calories: 
        <input ref={(weight * 15) - 500} onChange={(e) => setCalories(e.target.value)} type="text" name="calories" /> 
      </form>
      <form>
        <input onClick={handleSubmit} type="button" id="execute" value="Get my diet plan" />
      </form>
      <p id="advice">{adviceParagraph}</p>
      <form>
        Search nutrition data:
        <input ref={nutritionInput} onChange={(e) => setNutritionQuery(e.target.value)} type="text" name="nutrition" />
      </form>
      <form>
        <input onClick={handleNutritionSearch} type="button" id="nutritionSubmit" value="Search for nutrition data" />
      </form>
      <p id="nutritionData"></p>
    </div>
  );
}

export default App;
