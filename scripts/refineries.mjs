// Placeholder listings for the marketplace preview: real US refineries (operator, site,
// approximate nameplate capacity in barrels per calendar day, from public EIA figures),
// used only to make the preview look real. XTO has no relationship with any of them and
// nothing here is for sale. Edit this file, then run `npm run map` to regenerate
// src/data/marketplace.json (which also carries the projected map shapes).

// EIA Petroleum Administration for Defense Districts: the regions the listings are grouped by
export const REGIONS = [
  {
    key: 'gulf',
    padd: 3,
    name: 'Gulf Coast',
    blurb: 'Texas, Louisiana and the Mississippi coast: half of all American refining in one stretch of shoreline.',
    states: ['AL', 'AR', 'LA', 'MS', 'NM', 'TX'],
  },
  {
    key: 'midwest',
    padd: 2,
    name: 'Midwest',
    blurb: 'Inland plants fed by pipeline from the Bakken, Canada and the Gulf. They fuel the farm belt and the Great Lakes cities.',
    states: ['IL', 'IN', 'IA', 'KS', 'KY', 'MI', 'MN', 'MO', 'NE', 'ND', 'SD', 'OH', 'OK', 'TN', 'WI'],
  },
  {
    key: 'east',
    padd: 1,
    name: 'East Coast',
    blurb: 'The Delaware River and New Jersey plants that supply the Northeast corridor.',
    states: ['CT', 'ME', 'MA', 'NH', 'RI', 'VT', 'DE', 'DC', 'MD', 'NJ', 'NY', 'PA', 'FL', 'GA', 'NC', 'SC', 'VA', 'WV'],
  },
  {
    key: 'rockies',
    padd: 4,
    name: 'Rocky Mountains',
    blurb: 'Small, high-altitude refineries that run local crude for the mountain states.',
    states: ['CO', 'ID', 'MT', 'UT', 'WY'],
  },
  {
    key: 'west',
    padd: 5,
    name: 'West Coast',
    blurb: 'California, Puget Sound, Hawaii and Alaska: an island market with its own clean-fuel specs.',
    states: ['AK', 'AZ', 'CA', 'HI', 'NV', 'OR', 'WA'],
  },
]

// [operator, site name, city, state, capacity bpd, latitude, longitude]
const RAW = [
  // Gulf Coast
  ['Motiva', 'Port Arthur Refinery', 'Port Arthur', 'TX', 626000, 29.88, -93.955],
  ['Marathon', 'Galveston Bay Refinery', 'Texas City', 'TX', 631000, 29.378, -94.918],
  ['ExxonMobil', 'Beaumont Refinery', 'Beaumont', 'TX', 609000, 30.071, -94.08],
  ['ExxonMobil', 'Baytown Refinery', 'Baytown', 'TX', 564000, 29.742, -95.01],
  ['Marathon', 'Garyville Refinery', 'Garyville', 'LA', 597000, 30.057, -90.628],
  ['ExxonMobil', 'Baton Rouge Refinery', 'Baton Rouge', 'LA', 523000, 30.488, -91.182],
  ['Citgo', 'Lake Charles Refinery', 'Lake Charles', 'LA', 456000, 30.209, -93.282],
  ['Valero', 'Port Arthur Refinery', 'Port Arthur', 'TX', 395000, 29.909, -93.961],
  ['Chevron', 'Pascagoula Refinery', 'Pascagoula', 'MS', 356000, 30.344, -88.515],
  ['Valero', 'St. Charles Refinery', 'Norco', 'LA', 340000, 29.986, -90.37],
  ['Flint Hills Resources', 'Corpus Christi Complex', 'Corpus Christi', 'TX', 343000, 27.829, -97.52],
  ['Deer Park Refining', 'Deer Park Refinery', 'Deer Park', 'TX', 312000, 29.717, -95.129],
  ['Phillips 66', 'Lake Charles Refinery', 'Westlake', 'LA', 264000, 30.238, -93.272],
  ['Phillips 66', 'Sweeny Refinery', 'Old Ocean', 'TX', 265000, 29.071, -95.747],
  ['Valero', 'Texas City Refinery', 'Texas City', 'TX', 260000, 29.373, -94.93],
  ['Shell', 'Norco Manufacturing Complex', 'Norco', 'LA', 250000, 29.998, -90.405],
  ['TotalEnergies', 'Port Arthur Platform', 'Port Arthur', 'TX', 238000, 29.883, -93.93],
  ['Valero', 'Houston Refinery', 'Houston', 'TX', 235000, 29.718, -95.252],
  ['Valero', 'McKee Refinery', 'Sunray', 'TX', 200000, 36.022, -101.821],
  ['PBF Energy', 'Chalmette Refinery', 'Chalmette', 'LA', 185000, 29.942, -89.968],
  ['Citgo', 'Corpus Christi Refinery', 'Corpus Christi', 'TX', 167000, 27.812, -97.436],
  ['Marathon', 'El Paso Refinery', 'El Paso', 'TX', 131000, 31.74, -106.38],
  ['HF Sinclair', 'Navajo Refinery', 'Artesia', 'NM', 100000, 32.838, -104.405],
  ['Valero', 'Three Rivers Refinery', 'Three Rivers', 'TX', 100000, 28.462, -98.185],
  ['Delek US', 'Big Spring Refinery', 'Big Spring', 'TX', 73000, 32.258, -101.47],
  // Midwest
  ['BP', 'Whiting Refinery', 'Whiting', 'IN', 435000, 41.677, -87.489],
  ['Flint Hills Resources', 'Pine Bend Refinery', 'Rosemount', 'MN', 375000, 44.773, -93.04],
  ['Phillips 66', 'Wood River Refinery', 'Roxana', 'IL', 356000, 38.855, -90.073],
  ['Marathon', 'Catlettsburg Refinery', 'Catlettsburg', 'KY', 291000, 38.392, -82.598],
  ['ExxonMobil', 'Joliet Refinery', 'Channahon', 'IL', 275000, 41.422, -88.15],
  ['Marathon', 'Robinson Refinery', 'Robinson', 'IL', 253000, 39.008, -87.715],
  ['Phillips 66', 'Ponca City Refinery', 'Ponca City', 'OK', 200000, 36.714, -97.082],
  ['Valero', 'Memphis Refinery', 'Memphis', 'TN', 195000, 35.084, -90.08],
  ['Citgo', 'Lemont Refinery', 'Lemont', 'IL', 177000, 41.66, -88.067],
  ['Cenovus', 'Lima Refinery', 'Lima', 'OH', 175000, 40.73, -84.12],
  ['Cenovus', 'Toledo Refinery', 'Oregon', 'OH', 160000, 41.63, -83.49],
  ['Marathon', 'Detroit Refinery', 'Detroit', 'MI', 140000, 42.282, -83.111],
  ['HF Sinclair', 'El Dorado Refinery', 'El Dorado', 'KS', 135000, 37.823, -96.859],
  ['CVR Energy', 'Coffeyville Refinery', 'Coffeyville', 'KS', 132000, 37.03, -95.616],
  ['HF Sinclair', 'Tulsa Refinery', 'Tulsa', 'OK', 125000, 36.128, -95.985],
  ['Marathon', 'Mandan Refinery', 'Mandan', 'ND', 71000, 46.831, -100.886],
  // East Coast
  ['Phillips 66', 'Bayway Refinery', 'Linden', 'NJ', 258000, 40.636, -74.213],
  ['Monroe Energy', 'Trainer Refinery', 'Trainer', 'PA', 190000, 39.83, -75.41],
  ['PBF Energy', 'Delaware City Refinery', 'Delaware City', 'DE', 180000, 39.58, -75.635],
  ['PBF Energy', 'Paulsboro Refinery', 'Paulsboro', 'NJ', 160000, 39.838, -75.238],
  ['United Refining', 'Warren Refinery', 'Warren', 'PA', 70000, 41.84, -79.14],
  // Rocky Mountains
  ['Marathon', 'Salt Lake City Refinery', 'Salt Lake City', 'UT', 104000, 40.803, -111.912],
  ['Suncor', 'Commerce City Refinery', 'Commerce City', 'CO', 103000, 39.804, -104.95],
  ['HF Sinclair', 'Sinclair Refinery', 'Sinclair', 'WY', 94000, 41.78, -107.113],
  ['CHS', 'Laurel Refinery', 'Laurel', 'MT', 65000, 45.67, -108.78],
  ['Par Pacific', 'Billings Refinery', 'Billings', 'MT', 63000, 45.783, -108.5],
  // West Coast
  ['Marathon', 'Los Angeles Refinery', 'Carson', 'CA', 363000, 33.818, -118.247],
  ['Chevron', 'El Segundo Refinery', 'El Segundo', 'CA', 269000, 33.912, -118.408],
  ['BP', 'Cherry Point Refinery', 'Blaine', 'WA', 250000, 48.862, -122.739],
  ['Chevron', 'Richmond Refinery', 'Richmond', 'CA', 245000, 37.938, -122.38],
  ['PBF Energy', 'Torrance Refinery', 'Torrance', 'CA', 160000, 33.838, -118.33],
  ['PBF Energy', 'Martinez Refinery', 'Martinez', 'CA', 157000, 38.021, -122.1],
  ['HF Sinclair', 'Puget Sound Refinery', 'Anacortes', 'WA', 149000, 48.496, -122.566],
  ['Valero', 'Benicia Refinery', 'Benicia', 'CA', 145000, 38.071, -122.136],
  ['Marathon', 'Anacortes Refinery', 'Anacortes', 'WA', 119000, 48.485, -122.556],
  ['Phillips 66', 'Ferndale Refinery', 'Ferndale', 'WA', 105000, 48.818, -122.712],
  ['Par Pacific', 'Kapolei Refinery', 'Kapolei', 'HI', 94000, 21.31, -158.1],
  ['Petro Star', 'North Pole Refinery', 'North Pole', 'AK', 22000, 64.754, -147.349],
]

const regionOf = (st) => REGIONS.find((r) => r.states.includes(st)).key

// a stable little hash so the illustrative figures do not jump between builds
function hash(s) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619)
  return (h >>> 0) % 1000
}

const slug = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

export const REFINERIES = RAW.map(([operator, name, city, state, capacity, lat, lon]) => {
  const id = slug(`${operator}-${name}`)
  const h = hash(id)
  // ticker: operator initials + city letters, e.g. "MOT-PAR"
  const op = operator.replace(/[^A-Za-z0-9 ]/g, '').split(' ')[0].slice(0, 3).toUpperCase()
  const ct = city.replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase()
  return {
    id,
    operator,
    name,
    city,
    state,
    region: regionOf(state),
    capacity,
    lat,
    lon,
    ticker: `${op}-${ct}`,
    // illustrative: one token per barrel-per-day of capacity, priced in the $30s to $60s,
    // with some share "already placed" so the cards have a progress bar to draw
    price: 32 + (h % 31) + ((h >> 4) % 100) / 100,
    placed: 12 + (h % 71),
  }
})
