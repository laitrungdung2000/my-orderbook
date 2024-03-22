import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { FC } from 'react';

import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectGrouping, changeGroupTicketSize } from "../redux/slice/orderBookSlice";

interface GroupingSelectBoxProps {
    options: number[]
}

const GroupSelectBox: FC<GroupingSelectBoxProps> = ({options}) => {
    const groupTicketSize: number = useAppSelector(selectGrouping);
    console.log(groupTicketSize);
    const dispatch = useAppDispatch();
  

    const handleChange = (event: SelectChangeEvent) => {
        dispatch(changeGroupTicketSize(Number(event.target.value)));
    };
    return <Select sx={{backgroundColor:'white', width:150}}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={groupTicketSize.toString()}
            onChange={handleChange}>
            {options.map((option, idx) => <MenuItem key={idx} value={option.toString()}>Group {option}</MenuItem>)}
        </Select>
}

export default GroupSelectBox;