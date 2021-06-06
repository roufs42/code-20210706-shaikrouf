const express = require('express');
const fs = require('fs');
const JSONStream = require("JSONStream");
const es = require("event-stream");

let heightInMeters,weight;

fileStream = fs.createReadStream('./data.json', { encoding: "utf8" });
writeStream = fs.createWriteStream('./result.json',{ encoding: "utf8" });
console.log('BMI calculation started!');
let startTime = new Date(); 
fileStream.pipe(JSONStream.parse('*'))
.pipe(
  es.through(function(data) {
      heightInMeters = (data.HeightCm / 100);
      weight = data.WeightKg;
      BMI = (weight / (heightInMeters * heightInMeters));
      data['bmi'] = Number(BMI.toFixed(1));

      switch (true) {
        case (BMI < 18.5):
          data["bmi_category"] = "Under Weight";
          data["health_risk"] = "Malnutrition Risk";
          break;
        case (BMI >= 18.5 && BMI < 25):
          data["bmi_category"] = "Normal Weight";
          data["health_risk"] = "Low Risk";
          break;
        case (BMI >= 25 && BMI < 30):
          data["bmi_category"] = "Over Weight";
          data["health_risk"] = "Enhanced Risk";
          break;
        case (BMI >= 30 && BMI < 35):
          data["bmi_category"] = "Moderately Obese";
          data["health_risk"] = "Medium Risk";
          break;
        case (BMI >= 35 && BMI < 40):
          data["bmi_category"] = "Severely Obese";
          data["health_risk"] = "High Risk";
          break;
        case (BMI >= 40):
          data["bmi_category"] = "Very Severely Obese";
          data["health_risk"] = "Very High Risk";
          break;
      }

      writeStream.write(JSON.stringify(data))

}));

fileStream.on('end',()=>{
  let currentTime = new Date();

  console.log('BMI calculation done!');
  console.log('Saved in results.json file');
  console.log(`Entire process took ${currentTime - startTime} ms`);
})


  



