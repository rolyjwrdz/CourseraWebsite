let travelRecommendationAPI = null;

// ==============================
// Load JSON data
// ==============================
fetch("travelRecommendationAPI.json")
  .then(response => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then(data => {
    travelRecommendationAPI = data;
    console.log("Travel data loaded:", travelRecommendationAPI);
  })
  .catch(error => {
    console.error("Error loading JSON:", error);
  });

// ==============================
// Keyword mappings
// ==============================
const searchKeywords = {
  countries: {
    australia: ["australia", "sydney", "melbourne", "opera house", "harbour"],
    japan: ["japan", "tokyo", "kyoto", "temples", "culture", "cherry blossoms"],
    brazil: ["brazil", "rio", "rio de janeiro", "sao paulo", "carnival", "beaches"]
  },
  cities: {
    sydney: ["sydney", "australia", "opera house", "harbour bridge"],
    melbourne: ["melbourne", "art", "food", "culture"],
    tokyo: ["tokyo", "japan", "modern", "tradition", "city"],
    kyoto: ["kyoto", "temples", "gardens", "tea houses"],
    rio: ["rio", "beach", "carnival", "brazil"],
    saopaulo: ["sao paulo", "nightlife", "arts", "culture"]
  },
  temples: {
    angkorwat: ["angkor wat", "cambodia", "temple", "unesco", "historic"],
    tajmahal: ["taj mahal", "india", "love", "monument", "architecture"]
  },
  beaches: {
    borabora: ["bora bora", "island", "luxury", "beach", "ocean"],
    copacabana: ["copacabana", "rio", "brazil", "beach", "coast"]
  }
};

// ==============================
// DOM elements
// ==============================
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const resultsDiv = document.getElementById("results");

// ==============================
// Helper to display results
// ==============================
function displayResult(title, description, imageUrl) {
  resultsDiv.innerHTML += `
    <div class="card">
      <h3>${title}</h3>
      <img src="${imageUrl}" width="100%">
      <p>${description}</p>
    </div>
  `;
}


// ==============================
// Multi-result search logic
// ==============================
if (searchForm && searchInput && resultsDiv) {
  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const userSearch = searchInput.value.toLowerCase().trim();
    resultsDiv.innerHTML = "";

    if (!travelRecommendationAPI) {
      resultsDiv.textContent = "Travel data is still loading...";
      return;
    }

    let found = false;
    let shown = new Set();


    // ===== CATEGORY SEARCH: TEMPLES =====
    if (userSearch === "temple" || userSearch === "temples") {
      resultsDiv.innerHTML = "<h2>Temples</h2>";
      travelRecommendationAPI.temples.forEach(temple => {
        displayResult(temple.name, temple.description, temple.imageUrl);
      });
      found = true;
    }

    // ===== COUNTRY & CITY SEARCH =====
    travelRecommendationAPI.countries.forEach(country => {
      // Country match by name or keyword
      if (
      country.name.toLowerCase().includes(userSearch) ||
      searchKeywords.countries[country.name.toLowerCase()]?.includes(userSearch)
      ) {
      if (!found) resultsDiv.innerHTML += `<h2>Countries & Cities</h2>`;
      country.cities.forEach(city => {
        displayResult(city.name, city.description, city.imageUrl);
      });
      found = true;
      }

      // City match by name or keyword
      country.cities.forEach(city => {
        if (
          city.name.toLowerCase().includes(userSearch) ||
          searchKeywords.cities[city.name.split(",")[0].toLowerCase()]?.includes(userSearch)
        ) {
          if (!found) resultsDiv.innerHTML += `<h2>Countries & Cities</h2>`;
          displayResult(city.name, city.description, city.imageUrl);
          found = true;
        }
      });
    });

    // ===== TEMPLE SEARCH =====
    travelRecommendationAPI.temples.forEach(temple => {
      if (
        temple.name.toLowerCase().includes(userSearch) ||
        searchKeywords.temples[temple.name.replace(/\s+/g, "").toLowerCase()]?.includes(userSearch)
      ) {
        if (!found) resultsDiv.innerHTML += "<h2>Temples</h2>";
        displayResult(temple.name, temple.description, temple.imageUrl);
        found = true;
      }
    });

// ===== CATEGORY SEARCH: COUNTRIES =====
if (userSearch === "country" || userSearch === "countries") {
  resultsDiv.innerHTML = "<h2>Countries & Cities</h2>";

  travelRecommendationAPI.countries.forEach(country => {
    country.cities.forEach(city => {
      displayResult(city.name, city.description, city.imageUrl);
    });
  });

  found = true;
}


// ===== BEACH SEARCH =====
travelRecommendationAPI.beaches.forEach(beach => {
  const beachKey = beach.name
    .split(",")[0]          // "Bora Bora"
    .replace(/\s+/g, "")    // "BoraBora"
    .toLowerCase();         // "borabora"

  if (
    beach.name.toLowerCase().includes(userSearch) ||
    searchKeywords.beaches[beachKey]?.includes(userSearch)
  ) {
    if (!found) resultsDiv.innerHTML += "<h2>Beaches</h2>";
    displayResult(beach.name, beach.description, beach.imageUrl);
    found = true;
  }
});


    // ===== NO RESULTS =====
    if (!found) {
      resultsDiv.textContent = "No results found. Try another destination!";
    }
  });
} else {
  console.error("Search form, input, or results div not found in HTML");
}
