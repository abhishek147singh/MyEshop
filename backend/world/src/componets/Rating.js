import React from 'react'
import StarRateIcon from '@mui/icons-material/StarRate';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarOutlineIcon from '@mui/icons-material/StarOutline';

export default function Rating(props) {
    const { rating , font } = props;
    
  return (
    <div>
       <span>
          { rating >= 1 ? <StarRateIcon sx={{fontSize:font}}/> : rating >= 0.5  ? <StarHalfIcon sx={{fontSize:font}}/> : <StarOutlineIcon sx={{fontSize:font}}/>}
       </span>
       <span>
          { rating >= 2 ? <StarRateIcon sx={{fontSize:font}}/> : rating >= 1.5  ? <StarHalfIcon sx={{fontSize:font}}/> : <StarOutlineIcon sx={{fontSize:font}}/>}
       </span>
       <span>
          { rating >= 3 ? <StarRateIcon sx={{fontSize:font}}/> : rating >= 2.5  ? <StarHalfIcon sx={{fontSize:font}}/> : <StarOutlineIcon sx={{fontSize:font}}/>}
       </span>
       <span>
          { rating >= 4 ? <StarRateIcon sx={{fontSize:font}}/> : rating >= 3.5  ? <StarHalfIcon sx={{fontSize:font}}/> : <StarOutlineIcon sx={{fontSize:font}}/>}
       </span>
       <span>
          { rating >= 5 ? <StarRateIcon sx={{fontSize:font}}/> : rating >= 4.5  ? <StarHalfIcon sx={{fontSize:font}}/> : <StarOutlineIcon sx={{fontSize:font}}/>}
       </span>
    </div>
  )
}
