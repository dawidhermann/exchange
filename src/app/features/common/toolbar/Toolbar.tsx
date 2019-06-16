import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

interface IAppToolbarProps {
    title: string;
}
export type AppToolbarProps = IAppToolbarProps;

export default function AppToolbar(props: IAppToolbarProps): JSX.Element {
    return (
        <div>
          <AppBar position="static" color="primary">
            <Toolbar>
              <Typography variant="h6" color="inherit">
                {props.title}
              </Typography>
            </Toolbar>
          </AppBar>
        </div>
      );
}