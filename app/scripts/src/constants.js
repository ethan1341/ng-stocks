/**
 * Contstants that include the API routes and Sample Data
 */

app.constant('API',{
    userStocks:'/stocks',
    register:'/facebook',
    stockCharts:'/stockCharts',
    userInfo:'/userInfo',
    removeStock:'/removeStock'

});


app.constant('SAMPLE_DATA', {
    chart: {
        dates: ["2017-05-21T00:00:00", "2017-05-22T00:00:00", "2017-05-23T00:00:00", "2017-05-24T00:00:00", "2017-05-25T00:00:00", "2017-05-26T00:00:00", "2017-05-27T00:00:00"],
        values: [60.10, 62.40, 50.3, 45.1, 30.5, 60.4, 40.10],
        symbol: 'SAMPLE',
        name: 'Please select more symbols'
    }
});