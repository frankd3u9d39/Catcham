import { useCallback, useState } from 'react';
import * as Location from 'expo-location';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

interface LocationState {
  coordinates: Coordinates | null;
  isLocating: boolean;
  /** Null when nothing has gone wrong, or a message safe to show the user. */
  error: string | null;
  capture: () => Promise<Coordinates | null>;
  clear: () => void;
}

/**
 * On-demand location capture.
 *
 * It is deliberately not requested on mount: someone reporting anonymously
 * should decide when to share their position, and a permission prompt on first
 * launch invites a refusal that then has to be undone in system settings.
 *
 * Coordinates are rounded to five decimal places, roughly a metre, which is far
 * more precision than jurisdiction routing needs while avoiding a false sense
 * of exactness.
 */
export function useLocation(): LocationState {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const capture = useCallback(async (): Promise<Coordinates | null> => {
    setIsLocating(true);
    setError(null);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== Location.PermissionStatus.GRANTED) {
        setError(
          'Location permission was declined. You can still submit by choosing a state and LGA.',
        );
        return null;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const captured: Coordinates = {
        latitude: Number(position.coords.latitude.toFixed(5)),
        longitude: Number(position.coords.longitude.toFixed(5)),
      };

      setCoordinates(captured);
      return captured;
    } catch {
      setError('Could not get your location. Choose a state and LGA instead.');
      return null;
    } finally {
      setIsLocating(false);
    }
  }, []);

  const clear = useCallback(() => {
    setCoordinates(null);
    setError(null);
  }, []);

  return { coordinates, isLocating, error, capture, clear };
}
