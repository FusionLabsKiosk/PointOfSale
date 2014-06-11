var spreadsheet = {};

spreadsheet.MACRO_URL = 'https://script.google.com/macros/s/AKfycbw4AvoXKYaURCkaCmjwi7zQO54GCP45YaNnGQ0d8slA0ZGxiEw/exec';
spreadsheet.SPREADSHEET_ID = '1-ZzeKWI1VCYCUWVveI4KZVWHaMdhOy50yHyzFDmARJs';

spreadsheet.getAllData = function(callback) {
    var params = {
        'spreadsheetId': spreadsheet.SPREADSHEET_ID,
        'action': 'get'
    };
    
    $.ajax(spreadsheet.MACRO_URL, {
        data: params
    }).success(function(data) {
        var rows = [];
        
        var response = JSON.parse(data);
        if (response.status === 200) {
            for (var i = 0; i < response.data.length; i++) {
                rows.push(response.data[i]);
            }
        }
        else {
            console.log(response.message);
        }
        callback(rows);
    });
};