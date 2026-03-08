//Cleaned up geocoding for the app
/**
 * @typedef {Object} GeoResult
 * @property {number} lat
 * @property {number} lon
 * @property {string} displayName
 */

//Search location using Nominatim (OpenStreetMap)
//Converts user input into coordinates
/**
 * @param {string} query
 * @returns {Promise<GeoResult|null>}
 */
//Build the Nominatim search with parameters
async function geocode(query) {
  const url =
  "https://nominatim.openstreetmap.org/search?" +
    new URLSearchParams({
      q: query,
      format: "json",
      limit: "1",
    });

  //Fetch JSON result
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
  });

  //If theres an error - stop & throw
  if (!res.ok) throw new Error(`Geocode failed: ${res.status}`);

  //Parse JSON response
  const results = await res.json();
  if (!results.length) return null;

  //Take first match, normalize values to num
  const r = results[0];
  return {
    lat: Number(r.lat),
    lon: Number(r.lon),
    displayName: r.display_name ?? query,
  };
}

//Update OpenStreetMap iframe so it shows 
  //map centered around coordinates
  //marker at selected place
/**
 * @param {HTMLIFrameElement} frame
 * @param {number} lat
 * @param {number} lon
 * @returns {void}
 */

//Map details - zoom lvl & box around pt
function updateMap(frame, lat, lon) {
  const delta = 0.02;
  const left = lon - delta;
  const right = lon + delta;
  const top = lat + delta;
  const bottom = lat - delta;

  //Build the embed URL
  const src =
    "https://www.openstreetmap.org/export/embed.html?" +
    new URLSearchParams({
      bbox: `${left},${bottom},${right},${top}`,
      layer: "mapnik",
      marker: `${lat},${lon}`,
    });

  //Load map in iframe
  frame.src = src;
}

//Initialize the map page - if req elements arent foound it does nothing

/**
 * @returns {void}
 */

//Grab eleemnts from html pg
export function initMapPage() {
  const form = document.getElementById("mapForm");
  const input = document.getElementById("placeInput");
  const status = document.getElementById("placeStatus");
  const frame = document.getElementById("mapFrame");

  //If on wrong page nothing happens
  if (!form || !input || !status || !frame) return;

  //shows default map so page isnt empty
  updateMap(frame, 59.3293, 18.0686); // Stockholm
  status.textContent = "Sök efter en plats för att flytta markören.";

  //Handles search input
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    //Read & trim input
    const query = input.value.trim();
    if (!query) return;

    status.textContent = "Söker…";

    try {
      //Convert name into coordinates
      const result = await geocode(query);

      if (!result) {
        status.textContent = "Ingen träff. Försök med en annan plats.";
        return;
      }

      //Update iframe w new location & show
      updateMap(frame, result.lat, result.lon);
      status.textContent = `Visar: ${result.displayName}`;
    } catch (err) {
      console.error(err);
      status.textContent = "Något gick fel. Försök igen.";
    }
  });
}