/**
 * Represents a location in latitude(N)/longitude(E)
 */
export interface GeoLocation{
  /**
   * Latitude (N)
   */
  latitude: number;
  /**
   * Longitude (E)
   */
  longitude: number;
}

/**
 * Represents a location as country/city
 */
export interface NamedLocation{
  city: string;
  country: string;
}
