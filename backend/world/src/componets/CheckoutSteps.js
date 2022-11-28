// import { Grid } from '@mui/material'
// import React from 'react'

// export default function CheckoutSteps(props) {
//   return (
//     <div>
//         <Grid item container spacing={2} className = "checkout-steps">
//               <Grid item className = { props.step1 ? 'active' : '' } >Sign In</Grid>
//               <Grid item className = { props.step2 ? 'active' : '' } >Shipping</Grid>
//               <Grid item className = { props.step3 ? 'active' : '' } >Payment</Grid>
//               <Grid item className = { props.step4 ? 'active' : '' } >Place Order</Grid>
//         </Grid>
//     </div>
//   )
// }
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

const steps = [
  'Sign In',
  'Shipping',
  'Payment',
  'Place Order'
];

export default function HorizontalLabelPositionBelowStepper(props) {
  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={props.step4 ? 3 : props.step3 ? 2 : props.step2 ? 1 : props.step1 ? 0 : null } alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}