// import the asset to the script
// table: projects/ee-akapeterser/assets/philadelphia

// manually set limits of the philadelphia boundary file
var bound_lon1 = -75.2803031303464536
var bound_lat1 = 39.8674655706871448
var bound_lon2 = -74.9557457320632068
var bound_lat2 = 40.1379275281936856

// get the canopy in 2017
var naip2017 = ee.ImageCollection('USDA/NAIP/DOQQ')
.filterBounds(ee.Geometry.Rectangle(bound_lon1, bound_lat1, bound_lon2, bound_lat2))
.filterDate('2017-01-01', '2018-01-01');

// get the canopy in 2023 (as a proxy for 2024)
var naip2023 = ee.ImageCollection('USDA/NAIP/DOQQ')
.filterBounds(ee.Geometry.Rectangle(bound_lon1, bound_lat1, bound_lon2, bound_lat2))
.filterDate('2022-01-01', '2024-01-01');

// get ndiv for 2017
var mosaic2017 = naip2017.mosaic();
var red2017 = mosaic2017.select('R');
var nir2017 = mosaic2017.select('N');
var ndvi2017 = nir2017.subtract(red2017).divide(nir2017.add(red2017)).rename("NDVI");
var trees2017 = ndvi2017.gte(0).rename('trees');
// print(trees2017);

var ndviParams = {min: 0, max: 1, palette: ['yellow','green']};
// Map.addLayer(trees2017.clip(table), ndviParams, 'Vegecover 2017');


// get ndvi for 2023
var mosaic2023 = naip2023.mosaic();
var red2023 = mosaic2023.select('R');
var nir2023 = mosaic2023.select('N');
var ndvi2023 = nir2023.subtract(red2023).divide(nir2023.add(red2023)).rename("NDVI");
var trees2023 = ndvi2023.gte(0).rename('trees');
// print(trees2023);

Map.addLayer(trees2023.clip(table), ndviParams, 'Vegecover 2024');

// compute the difference between years
var difference = trees2023.subtract(trees2017);

// visualize the difference
var differenceParams = {palette: 'FF0000, 000000, 00FF00', min: -0.3, max: 0.3}
Map.addLayer(difference.clip(table), differenceParams, 'Vegetation difference 2017 to 2023');


// export to google drive
// Export.image.toDrive({
//   image: difference.clip(table),
//   description: 'CanopyDiff',
//   scale: 10,
//   region: ee.Geometry.Rectangle(bound_lon1, bound_lat1, bound_lon2, bound_lat2),
//   maxPixels: 1e11
// })