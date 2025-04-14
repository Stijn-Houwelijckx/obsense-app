export const getPlacedObjectPayload = async (
  objectId,
  objects,
  collection,
  calculateGeoCoordinates,
  deviceHeading
) => {
  const currentObject = objects.find((obj) => obj.id === objectId);
  if (!currentObject) return null;

  const geoCoordinates = await calculateGeoCoordinates(currentObject.position);

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
    },
  };
};
