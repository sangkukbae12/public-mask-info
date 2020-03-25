import React from 'react';
import LocationSearchingIcon from '@material-ui/icons/LocationSearching';
import { useMapState, useMapDispatch } from '../../context';

const LocationSearch = () => {
  const { kakao, map } = useMapState();
  const dispatch = useMapDispatch();

  const getLocation = () => {
    if (navigator.geolocation) {
      dispatch({ type: 'SET_PENDING', payload: true });
      navigator.geolocation.getCurrentPosition(
        position => {
          const { coords } = position;
          const { latitude, longitude } = coords;
          const moveLatLng = new kakao.maps.LatLng(latitude, longitude);
          map.panTo(moveLatLng);
          dispatch({ type: 'SET_BOUNDS' });
          dispatch({ type: 'SET_PENDING' });
        },
        () => {
          dispatch({ type: 'SET_PENDING', payload: false });
          dispatch({
            type: 'SET_ERROR',
            payload: '내 위치를 불러올 수 없습니다.'
          });
        }
      );
    } else {
      dispatch({
        type: 'SET_ERROR',
        payload: '내 위치를 불러올 수 없습니다.'
      });
    }
  };

  return (
    <div>
      <LocationSearchingIcon onClick={getLocation} />
    </div>
  );
};

export default LocationSearch;
