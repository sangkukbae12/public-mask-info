import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles(theme => ({
  normal: {
    padding: theme.spacing(0.7),
    color: '#fff',
    textAlign: 'center',
    minWidth: 40
  },
  title: {
    fontSize: 13,
    fontWeight: 700
  },
  content: {
    fontSize: 11
  }
}));
