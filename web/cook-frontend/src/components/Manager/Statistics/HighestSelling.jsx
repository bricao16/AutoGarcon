import React from 'react';
import {
    XYPlot,
    XAxis, // Shows the values on x axis
    YAxis, // Shows the values on y axis
    VerticalBarSeries,
    LabelSeries
} from 'react-vis';
class HighestSelling extends React.Component {
    render() {
        const data = this.props.data;
        const chartWidth = 800;
        const chartHeight = 400;
        const chartDomain = [0, chartHeight];
        return (
            <XYPlot 
                xType="ordinal" 
                width={chartWidth} 
                height={chartHeight} 
                yDomain={chartDomain}
            >
                <XAxis />
                <YAxis />
                <VerticalBarSeries
                    data={data}
                />
                <LabelSeries
                    data={data.map(obj => {
                        console.log(obj.label);
                        return { ...obj, label: obj.label.toString() }
                    })}
                    labelAnchorX="middle"
                    labelAnchorY="text-after-edge"
                />
            </XYPlot>
        );
    }
}
export default HighestSelling;
 