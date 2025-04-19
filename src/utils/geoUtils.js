import merc from "mercator-projection";

export const calculateGeoCoordinates = (
  arPosition,
  arOriginGeoCoordinates,
  initialHeading
) => {
  return new Promise((resolve, reject) => {
    if (!arOriginGeoCoordinates) {
      reject(new Error("AR origin coordinates are not set."));
      return;
    }

    // Convert AR origin's geographic coordinates to Mercator
    const arOriginPoint = merc.fromLatLngToPoint({
      lat: arOriginGeoCoordinates.latitude,
      lng: arOriginGeoCoordinates.longitude,
    });

    console.log("AR Origin Point: ", arOriginPoint);
    console.log("AR Position: ", arPosition);

    // Calculate meters per pixel at the AR origin's latitude
    const metersPerPixel =
      (40075016.686 / 256) *
      Math.cos((arOriginGeoCoordinates.latitude * Math.PI) / 180);

    const headingRad = (initialHeading * Math.PI) / 180;

    // Adjust AR position based on the initial heading
    const cosH = Math.cos(-headingRad);
    const sinH = Math.sin(-headingRad);

    const adjustedX = arPosition[0] * cosH - arPosition[2] * sinH;
    const adjustedZ = arPosition[0] * sinH + arPosition[2] * cosH;

    // Scale AR space offsets (in meters) to Mercator units
    const scaledOffsetX = adjustedX / metersPerPixel; // Adjusted X-axis in AR
    const scaledOffsetY = adjustedZ / metersPerPixel; // Adjusted Z-axis in AR corresponds to Y in Mercator

    // Add scaled offsets to the AR origin's Mercator coordinates
    const objectPoint = {
      x: arOriginPoint.x + scaledOffsetX,
      y: arOriginPoint.y + scaledOffsetY,
    };

    // Convert back to geographic coordinates (lat/lon)
    const objectGeo = merc.fromPointToLatLng(objectPoint);
    resolve(objectGeo);
  });
};

export const calculateARCoordinates = (
  geoCoordinates,
  arOriginGeoCoordinates,
  initialHeading
) => {
  return new Promise((resolve, reject) => {
    if (!arOriginGeoCoordinates) {
      reject(new Error("AR origin coordinates are not set."));
      return;
    }

    // Convert AR origin's geographic coordinates to Mercator
    const arOriginPoint = merc.fromLatLngToPoint({
      lat: arOriginGeoCoordinates.latitude,
      lng: arOriginGeoCoordinates.longitude,
    });

    // Convert the given geographic coordinates to Mercator
    const objectPoint = merc.fromLatLngToPoint({
      lat: geoCoordinates.lat,
      lng: geoCoordinates.lng,
    });

    console.log("AR Origin Point: ", arOriginPoint);
    console.log("Object Point: ", objectPoint);

    // Calculate meters per pixel at the AR origin's latitude
    const metersPerPixel =
      (40075016.686 / 256) *
      Math.cos((arOriginGeoCoordinates.latitude * Math.PI) / 180);

    // Calculate the offsets in Mercator units
    const offsetX = (objectPoint.x - arOriginPoint.x) * metersPerPixel;
    const offsetY = (objectPoint.y - arOriginPoint.y) * metersPerPixel;

    // Adjust the offsets based on the initial heading
    const headingRad = (initialHeading * Math.PI) / 180;
    const cosH = Math.cos(headingRad);
    const sinH = Math.sin(headingRad);

    const adjustedX = offsetX * cosH - offsetY * sinH;
    const adjustedZ = offsetX * sinH + offsetY * cosH;

    console.log("Adjusted X:", adjustedX, "Adjusted Z:", adjustedZ);

    // Return the AR space coordinates
    resolve([adjustedX, 0, adjustedZ]); // Assuming y (height) is 0
  });
};
