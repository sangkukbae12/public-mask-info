import React, { useState } from 'react';
import { useStyles } from './SearchBarStyle';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  Menu,
  MenuItem
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import LocationSearch from './LocationSearch';
import RenewStore from './RenewStore';
import { useMapState, useMapDispatch } from '../../context';

export default function SearchBar() {
  const classes = useStyles();
  const [searchText, setSearchText] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const { kakao, map } = useMapState();
  const dispatch = useMapDispatch();

  const searchPlace = keyword => {
    dispatch({ type: 'SET_PENDING', payload: true });
    const places = new kakao.maps.services.Places();
    places.keywordSearch(keyword, (result, status) => {
      if (status === kakao.maps.services.Status.OK) {
        console.log(result);
        const firstItem = result[0];
        const { x, y } = firstItem;
        const moveLatLng = new kakao.maps.LatLng(y, x);
        map.panTo(moveLatLng);
        map.setLevel(3);
      } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        dispatch({
          type: 'SET_ERROR',
          payload: '검색 결과가 없습니다.'
        });
      } else {
        dispatch({
          type: 'SET_ERROR',
          payload: '서비스에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.'
        });
      }
      dispatch({ type: 'SET_PENDING', payload: false });
    });
  };

  const handleSearch = searchText => {
    if (searchText) searchPlace(searchText);
  };

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = event => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton aria-label="show 4 new mails" color="inherit" size="small">
          <LocationSearch />
        </IconButton>
      </MenuItem>
      <MenuItem>
        <IconButton
          aria-label="show 11 new notifications"
          color="inherit"
          size="small"
        >
          <RenewStore />
        </IconButton>
      </MenuItem>
    </Menu>
  );
  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <Typography className={classes.title} variant="h6" noWrap>
            😷 공적 마스크 판매 현황
          </Typography>
          <div className={classes.search}>
            {/* <div className={classes.searchIcon}>
              <SearchIcon onClick={searchPlace} />
            </div> */}
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput
              }}
              value={searchText}
              inputProps={{ 'aria-label': 'search' }}
              onChange={e => setSearchText(e.target.value)}
              onKeyPress={e => {
                const enterPressed = e.charCode === 13;
                if (enterPressed) {
                  handleSearch(searchText);
                  e.target.blur();
                }
              }}
            />
          </div>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <IconButton aria-label="location search" color="inherit">
              <LocationSearch />
            </IconButton>
            <IconButton aria-label="renew" color="inherit">
              <RenewStore />
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreVertIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
}
