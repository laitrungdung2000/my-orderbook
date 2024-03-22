import { FC } from "react";
import { GroupFunctionButtonProps } from "../interfaces/GroupFunctionButtonInterfaces";
import { Button, Grid } from "@mui/material";
import SyncAltIcon from '@mui/icons-material/SyncAlt';

const GroupFunctionButton: FC<GroupFunctionButtonProps> = ({ switchFeed, killFeed , isFeedKilled}) => {
    return <Grid
            sx={{mb:2}}
            container
            direction="row"
            justifyContent="center"
            alignItems="center">
        {
            !isFeedKilled && <Button sx={{textTransform: 'capitalize'}} variant="contained" color="secondary" onClick={switchFeed}>
                <SyncAltIcon /> Toggle Feed
            </Button>
        }
        <Button sx={{ml:2, textTransform: 'capitalize'}} variant="contained" color="error" onClick={killFeed}>
            {isFeedKilled ? 'Restart feed' : 'Kill Feed'}
        </Button>
    </Grid>
}

export default GroupFunctionButton;