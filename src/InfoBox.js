import React from 'react'
import {Card, CardContent, Typography} from '@material-ui/core'
import './InfoBox.css'

function InfoBox({title, cases, isRed,active, total, ...props}) {
  return (
    <Card onClick={props.onClick} className={`infoBox ${active && "infoBox--selected"}
        ${isRed && "infoBox--red"}`} >
        <CardContent>
            <Typography className="infoBox_title" color="textSecondary">
                {title}
            </Typography>
            <h1 className= {`infoBox__cases ${! isRed && "infoBox__cases--green"}`}>
                {cases}
            </h1>
            <Typography className='infoBox_total' color="textSecondary">
                {total} Total
            </Typography>
        </CardContent>
    </Card>
    )
}

export default InfoBox