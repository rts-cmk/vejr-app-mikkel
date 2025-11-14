import { useState, useEffect } from 'react';

const useLocation = () => {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    accuracy: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      setLoading(false);
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 600000, // 10 minutes
    };

    const handleSuccess = (position) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      });
      setLoading(false);
      setError(null);
    };

    const handleError = (error) => {
      let errorMessage = 'An unknown error occurred';
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Location access denied by user';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Location information is unavailable';
          break;
        case error.TIMEOUT:
          errorMessage = 'Location request timed out';
          break;
        default:
          errorMessage = 'An unknown error occurred';
          break;
      }
      
      setError(errorMessage);
      setLoading(false);
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, options);
  }, []);

  const refetch = () => {
    setLoading(true);
    setError(null);
    
    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0, // Force fresh location
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setLoading(false);
        setError(null);
      },
      (error) => {
        let errorMessage = 'An unknown error occurred';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
          default:
            errorMessage = 'An unknown error occurred';
            break;
        }
        
        setError(errorMessage);
        setLoading(false);
      },
      options
    );
  };

  return {
    location,
    loading,
    error,
    refetch,
  };
};

export default useLocation;