export const getPlacedObjectPayload = async (
  objectId,
  currentObject,
  collection,
  geoCoordinates,
  deviceHeading,
  arOriginGeoCoordinates,
  arOriginHeading
) => {
  return {
    placedObject: {
      placedObjectId: String(objectId),
      collectionId: collection._id,
      objectId: currentObject.objectId,
      position: {
        lat: geoCoordinates.lat,
        lon: geoCoordinates.lng,
        x: currentObject.position[0],
        y: currentObject.position[1] || 1,
        z: currentObject.position[2],
      },
      scale: {
        x: currentObject.scale[0],
        y: currentObject.scale[1],
        z: currentObject.scale[2],
      },
      rotation: {
        x: currentObject.rotation[0],
        y: currentObject.rotation[1],
        z: currentObject.rotation[2],
      },
      deviceHeading,
      origin: {
        lat: arOriginGeoCoordinates.latitude,
        lon: arOriginGeoCoordinates.longitude,
        heading: arOriginHeading,
      },
    },
  };
};
