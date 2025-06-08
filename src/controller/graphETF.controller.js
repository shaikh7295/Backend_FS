const moment = require('moment');

const graphETF = (req, res) => {
    try {
        const tenure = req.params.tenure || 'Daily';
        const validTenures = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'];

        if (!validTenures.includes(tenure)) {
            return res.status(400).json({ status: false, message: 'Invalid tenure parameter' });
        }

        const dummyData = require('../utils/dummy.json');  
        const { aggregatedData, aggregateADV } = aggregateData(dummyData, tenure);

        const response = {
            status: true,
            message: "Success",
            response: {
                portfolioData: {
                    data: {
                        aggregateADV: aggregateADV.toFixed(2),
                        ETF1: aggregatedData.ETF1,
                        ETF2: aggregatedData.ETF2,
                        ETF3: aggregatedData.ETF3
                    }
                }
            }
        };

        return res.json(response);
    } catch (error) {
        console.error('Error in graphETF controller:', error);
        return res.status(500).json({ status: false, message: 'Internal server error' });
    }
};

function aggregateData(dummyData, tenure) {
    const etf1 = dummyData.response.portfolioData.data.ETF1;
    const etf2 = dummyData.response.portfolioData.data.ETF2;
    const etf3 = dummyData.response.portfolioData.data.ETF3;

    const combinedData = etf1.map((item, index) => ({
        date: moment(item.date),
        ETF1: item.last,
        ETF2: etf2[index]?.last || 0,
        ETF3: etf3[index]?.last || 0
    }));

    let aggregateADV;

    if (tenure === 'Daily') { 
        const numberOfDays = combinedData.length;
        const totalETF1 = combinedData.reduce((sum, item) => sum + item.ETF1, 0);
        const totalETF2 = combinedData.reduce((sum, item) => sum + item.ETF2, 0);
        const totalETF3 = combinedData.reduce((sum, item) => sum + item.ETF3, 0);

        const avgETF1 = totalETF1 / numberOfDays;
        const avgETF2 = totalETF2 / numberOfDays;
        const avgETF3 = totalETF3 / numberOfDays;

        aggregateADV = avgETF1 + avgETF2 + avgETF3;
 
        const aggregatedData = {
            ETF1: combinedData.map(item => ({
                date: item.date.format('YYYY-MM-DD'),
                last: item.ETF1
            })),
            ETF2: combinedData.map(item => ({
                date: item.date.format('YYYY-MM-DD'),
                last: item.ETF2
            })),
            ETF3: combinedData.map(item => ({
                date: item.date.format('YYYY-MM-DD'),
                last: item.ETF3
            }))
        };

        return { aggregatedData, aggregateADV };
    }
 
    let unit, format;
    switch (tenure) {
        case 'Weekly':
            unit = 'week';
            format = 'YYYY-WW';
            break;
        case 'Monthly':
            unit = 'month';
            format = 'YYYY-MM';
            break;
        case 'Quarterly':
            unit = 'quarter';
            format = 'YYYY-[Q]Q';
            break;
        case 'Yearly':
            unit = 'year';
            format = 'YYYY';
            break;
        default:
            unit = 'day';
            format = 'YYYY-MM-DD';
    }

    const grouped = {};
    combinedData.forEach(item => {
        const key = item.date.startOf(unit).format(format);
        if (!grouped[key]) {
            grouped[key] = { ETF1: [], ETF2: [], ETF3: [] };
        }
        grouped[key].ETF1.push(item.ETF1);
        grouped[key].ETF2.push(item.ETF2);
        grouped[key].ETF3.push(item.ETF3);
    });

    const aggregated = {};
    Object.keys(grouped).forEach(key => {
        aggregated[key] = {
            ETF1: grouped[key].ETF1.reduce((sum, val) => sum + val, 0) / grouped[key].ETF1.length,
            ETF2: grouped[key].ETF2.reduce((sum, val) => sum + val, 0) / grouped[key].ETF2.length,
            ETF3: grouped[key].ETF3.reduce((sum, val) => sum + val, 0) / grouped[key].ETF3.length
        };
    });
 
    const numberOfPeriods = Object.keys(aggregated).length;
    const totalAggregatedETF1 = Object.values(aggregated).reduce((sum, item) => sum + item.ETF1, 0);
    const totalAggregatedETF2 = Object.values(aggregated).reduce((sum, item) => sum + item.ETF2, 0);
    const totalAggregatedETF3 = Object.values(aggregated).reduce((sum, item) => sum + item.ETF3, 0);

    const avgAggregatedETF1 = totalAggregatedETF1 / numberOfPeriods;
    const avgAggregatedETF2 = totalAggregatedETF2 / numberOfPeriods;
    const avgAggregatedETF3 = totalAggregatedETF3 / numberOfPeriods;

    aggregateADV = avgAggregatedETF1 + avgAggregatedETF2 + avgAggregatedETF3;

    
    const aggregatedData = {
        ETF1: [],
        ETF2: [],
        ETF3: []
    };
    Object.keys(aggregated).forEach(key => {
        aggregatedData.ETF1.push({ date: key, last: aggregated[key].ETF1 });
        aggregatedData.ETF2.push({ date: key, last: aggregated[key].ETF2 });
        aggregatedData.ETF3.push({ date: key, last: aggregated[key].ETF3 });
    });

    return { aggregatedData, aggregateADV };
}
module.exports = { graphETF };