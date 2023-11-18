import React from 'react';
import './featureInfo.css';
import ArchiveIcon from '@mui/icons-material/Archive';
import { Grid } from '@mui/material';

const FeatureInfo = () => {
    return (
        <Grid container spacing={2}>
            <Grid item xs={4}>
                <div className='featureInfo'>
                    <div className="featureItem commonBgStyle">
                        <div>
                            <h3 className="featureTitle">Revanue</h3>
                            <span>$10,723</span>
                        </div>
                        <div className="featureIcon">
                            <ArchiveIcon />
                        </div>
                    </div>
                </div>
            </Grid>
            <Grid item xs={4}>
                <div className='featureInfo'>
                    <div className="featureItem commonBgStyle">
                        <div>
                            <h3 className="featureTitle">Cost</h3>
                            <span>$9,723</span>
                        </div>
                        <div className="featureIcon">
                            <ArchiveIcon />
                        </div>
                    </div>
                </div>
            </Grid>
            <Grid item xs={4}>
                <div className='featureInfo'>
                    <div className="featureItem commonBgStyle">
                        <div>
                            <h3 className="featureTitle">Sales</h3>
                            <span>$2,723</span>
                        </div>
                        <div className="featureIcon">
                            <ArchiveIcon />
                        </div>
                    </div>
                </div>
            </Grid>
        </Grid>
    );
};

export default FeatureInfo;