document.addEventListener("DOMContentLoaded", async function () {
  var populations = [];
  async function getCountryData(country) {
    try {
      const url = `https://get-population.p.rapidapi.com/population/country?country=${country}`;
      const options = {
        method: "GET",
        headers: {
          "X-RapidAPI-Key":
            "afb5b83fd2mshef439245f151a0dp1f18a4jsnfff68b5733a0",
          "X-RapidAPI-Host": "get-population.p.rapidapi.com",
        },
      };

      const response = await fetch(url, options);
      const result = await response.json();
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async function getCovidStat(country) {
    try {
      const url = `https://covid-19-coronavirus-statistics.p.rapidapi.com/v1/total?country=${country}`;
      const options = {
        method: "GET",
        headers: {
          "X-RapidAPI-Key":
            "afb5b83fd2mshef439245f151a0dp1f18a4jsnfff68b5733a0",
          "X-RapidAPI-Host": "covid-19-coronavirus-statistics.p.rapidapi.com",
        },
      };

      const response = await fetch(url, options);
      const result = await response.json();
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  const countries = ["China", "India", "Indonesia", "Pakistan"];
  const populationContainer = document.getElementById("box_stat");

  const colors = ["#483D8B", "#5F9EA0", "#2F4F4F", "#FF5733", "#33FF73"];

  try {
    for (let i = 0; i < countries.length; i++) {
      const country = countries[i];
      const countryData = await getCountryData(country);
      const population = countryData.readable_format;

      const statElement = document.createElement("div");
      statElement.className = "stat";

      const statTextElement = document.createElement("span");
      statTextElement.className = "stat_text";
      statTextElement.textContent = country;

      const populationElement = document.createElement("span");
      populationElement.className = "population";
      populationElement.textContent = population;

      statElement.appendChild(statTextElement);
      statElement.appendChild(populationElement);

      // Assign color based on index
      statElement.style.backgroundColor = colors[i];

      populationContainer.appendChild(statElement);
      populations.push(countryData.count);
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }

  const countryCovidStat = [];
  try {
    for (let j = 0; j < countries.length; j++) {
      const country = countries[j];
      const covidData = await getCovidStat(country);
      const deaths = covidData.data.deaths;
      const confirmed = covidData.data.confirmed;
      countryCovidStat.push({ deaths, confirmed });
    }
    console.log(countryCovidStat);
  } catch (error) {
    console.error("An error occurred:", error);
  }

  new Chart(document.getElementById("chart_box"), {
    type: "doughnut",
    options: {
      animation: true,
      plugins: {
        legend: {
          display: true,
        },
        tooltip: {
          enabled: true,
        },
      },
    },
    data: {
      labels: ["China", "India", "Indonesia", "Pakistan"],
      datasets: [
        {
          label: "Population.",
          data: [
            populations[0],
            populations[1],
            populations[2],
            populations[3],
          ],
          backgroundColor: [
            "#483D8B",
            "#5F9EA0",
            "#2F4F4F",
            "#FF5733",
            "#33FF73",
          ],
          hoverOffset: 4,
        },
      ],
    },
  });

  // barchart

  const ctx = document.getElementById("bar_box");
  const data = {
    labels: [
      `China (death: ${countryCovidStat[0]["deaths"]}, confirmed: ${countryCovidStat[0]["deaths"]})`,
      `India (death: ${countryCovidStat[1]["deaths"]}, confirmed: ${countryCovidStat[1]["deaths"]})`,
      `Indonesia (death: ${countryCovidStat[2]["deaths"]}, confirmed: ${countryCovidStat[2]["deaths"]})`,
      `Pakistan (death: ${countryCovidStat[3]["deaths"]}, confirmed: ${countryCovidStat[3]["deaths"]})`,
    ],
    datasets: [
      {
        label: "Confirmed",
        data: [
          countryCovidStat[0]["confirmed"],
          countryCovidStat[1]["confirmed"],
          countryCovidStat[2]["confirmed"],
          countryCovidStat[3]["confirmed"],
        ],
        backgroundColor: "#483D8B",
      },
      {
        label: "Death",
        data: [
          countryCovidStat[0]["deaths"],
          countryCovidStat[1]["deaths"],
          countryCovidStat[2]["deaths"],
          countryCovidStat[3]["deaths"],
        ],
        backgroundColor: "#FF5733",
      },
    ],
  };

  const config = {
    type: "bar",
    data: data,
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: 46000000,
          stepSize: 100000,
        },
      },
    },
  };

  if (ctx) {
    new Chart(ctx, config);
  }
});
