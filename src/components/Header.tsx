import { Container, Grid } from "@mui/material";
import GroupSelectBox from "./GroupSelectBox";
import { FC } from "react";

interface HeaderProps {
    options: number[];
}

const Header:FC<HeaderProps> = ({options}) => {
    return <Container>
        <Grid container
            direction="row"
            justifyContent="space-between"
            alignItems="center">
            <h3>Order Book</h3>
            <GroupSelectBox options={options}/>
        </Grid>
    </Container>
}

export default Header;