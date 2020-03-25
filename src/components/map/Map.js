import React, { useEffect, useCallback } from 'react';
import { useStyles } from './MapStyle';
import { useMapState, useMapDispatch, useDebounce } from '../../context';
// import { fetchStoreByBounds } from '../../api/fetchStoreByBounds';
import { renderToStaticMarkup } from 'react-dom/server';
import StoreOverlay from './StoreOverlay';
import tippy, { hideAll } from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import axios from 'axios';

const Map = () => {
  const { kakao, map, serviceOpen, stores, bounds } = useMapState();
  const dispatch = useMapDispatch();
  const classes = useStyles();
  // const [bounds, setBounds] = useState(null);
  const debouncedBounds = useDebounce(bounds, 500);

  // const getBounds = useCallback(() => {
  //   return map.getBounds();
  // }, [map]);

  const removeAllShopOverlays = () => {
    document
      .querySelectorAll('[data-store-code]')
      .forEach(e => e.parentNode.removeChild(e));
  };

  const setStoreOverlays = stores =>
    setTimeout(() => {
      hideAll();
      console.log('stores', stores);
      removeAllShopOverlays();
      stores.forEach(store => {
        const {
          // code, // 판매기관코드
          // name, // 판매기관명
          // type, // 판매처 유형 (약국: 01, 우체국: 02, 농협: 03)
          // addr, // 주소
          // tel, // 연락처
          // stock_d, // 입고일
          // stock_t, // 입고시간
          // stock_cnt, // 입고수량
          // sold_cnt, // 판매수량
          // remain_cnt, // 잔고수량
          // sold_out, // 완판여부
          lat, // 위도
          lng // 경도
        } = store;

        const overlay = new kakao.maps.CustomOverlay({
          map,
          clickable: true,
          position: new kakao.maps.LatLng(lat, lng),
          content: renderToStaticMarkup(<StoreOverlay {...store} />),
          zIndex: 99999
        });
        overlay.setMap(map);
        tippy('[data-tippy-content]', { allowHTML: true });
      });
    }, 0);

  // create map
  useEffect(() => {
    const container = document.getElementById('map');
    const options = {
      center: new kakao.maps.LatLng(37.648003589240496, 126.8949582587247),
      level: 5
    };
    const map = new kakao.maps.Map(container, options);
    dispatch({
      type: 'CREATE_MAP',
      payload: map
    });
  }, [kakao.maps]);

  useEffect(() => {
    const onChange = function() {
      const level = map.getLevel();
      if (level <= 5) {
        dispatch({ type: 'SET_BOUNDS' });
      } else {
        removeAllShopOverlays();
      }
    };

    if (map) {
      kakao.maps.event.addListener(map, 'tilesloaded', onChange);
    }
  }, [map]);

  // fetch store
  useEffect(() => {
    if (bounds) {
      console.log('bounds', bounds);
      const center = map.getCenter();
      const { Ha: lat, Ga: lng } = center;
      const level = map.getLevel();
      const radius = (level + 4) ** 2 * 12;
      console.log('center', center);
      console.log('radius', radius);
      if (serviceOpen) {
        dispatch({ type: 'SET_PENDING', payload: true });

        const fetchStoreByBounds = async (lat, lng, radius) => {
          const res = await axios.get(
            `/.netlify/functions/fetchStore?lat=${lat}&lng=${lng}&radius=${radius}`
          );
          const stores = res.data.stores;
          dispatch({ type: 'FETCH_STORE', payload: stores });
          dispatch({ type: 'SET_PENDING', payload: false });
          console.log('stores', stores);
        };

        fetchStoreByBounds(lat, lng, radius);

        // fetchStoreByBounds(lat, lng, radius).then(response => {
        //   const stores = response.data.stores;
        //   dispatch({ type: 'FETCH_STORE', payload: stores });
        //   dispatch({ type: 'SET_PENDING', payload: false });
        //   console.log('stores', stores);
        // });
      }
    }
  }, [debouncedBounds]);

  // store overlay
  useEffect(() => {
    if (stores) {
      setStoreOverlays(stores);
    } else {
      return;
    }
  }, [stores]);

  return (
    <div>
      <div id="map" className={classes.map} />
    </div>
  );
};

export default Map;
