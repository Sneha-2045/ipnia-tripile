function getGooglePlacesConfig() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY || "";
  return {
    apiKey,
    isConfigured: Boolean(apiKey),
    photoMaxWidth: Number(process.env.GOOGLE_PLACES_PHOTO_MAX_WIDTH || 1200),
  };
}

module.exports = {
  getGooglePlacesConfig,
};
