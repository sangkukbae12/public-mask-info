import React from 'react';
import RefreshIcon from '@material-ui/icons/Refresh';
import { useMapDispatch, useMapState } from '../../context';

const RenewStore = () => {
  const { map } = useMapState();
  const dispatch = useMapDispatch();

  const renew = () => {
    if (map) {
      const level = map.getLevel();
      if (level <= 5) {
        dispatch({ type: 'SET_BOUNDS' });
      }

      console.log('renew click');
    }
  };

  return (
    <div>
      <RefreshIcon onClick={renew} />
    </div>
  );
};

export default RenewStore;
