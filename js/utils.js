/*------------------------------------------------------------------------------
    :: Colors
------------------------------------------------------------------------------*/

// Map colors light to dark

// Map
var colors = ['#FFEDA0', '#FED976', '#FEB24C', '#FD8D3C', '#FC4E2A', '#E31A1C', '#BD0026', '#800026'];
var greenColors = ['#31a354', '#74c476'];
var grayColor = '#cccccc';


/*------------------------------------------------------------------------------
    :: formatter
------------------------------------------------------------------------------*/

function format_number(num){
    if( 999999 < num){ // over 1,000,000+
        return (Math.floor(num / 100000) / 10) + '<span>k</span>';
    } 
    if( 999 < num ){ // between 1,000-999,999
        return (Math.floor(num / 100) / 10) + '<span>k</span>';
    }
    return num; // < 1,000
}

/*------------------------------------------------------------------------------
    :: CSV Download
------------------------------------------------------------------------------*/

/* Generate a CSV prepared string from a jQuery.DataTables instance
 *
 * Data is converted using encodeURIComponent to a ULI suitable for download.
 * Partiall based on: JSFiddle: http://jsfiddle.net/terryyounghk/KPEGU/
*/

var csv_labels = [
    'Geography',
    'Year',
    'Rate Age 0-17',
    'Rate 18+',
    'Rate All Ages',
]
var csv_keys = [
    // 'geography', // skip geography since it is the object key, on a value in within
    'year',
    'rate_0',
    'rate_18',
    'rate_all',
]

/*  Take a set of jsonData and return a CSV string suitable for to 
 *  output as a CSV download.
 *
 *  jsonData is a {} where each key has the form:
 *  
 *  key_name: {
 *      number_0_17: <value>,
 *      number_18_plus: <value>,
 *      number_all_ages: <value>,
 *      rate_0_17: <value>,
 *      rate_18_plus: <value>,
 *      rate_all_ages: <value>,
 *  }
*/
function make_csv_data(jsonData){

    var csv = '';

    // Add data source name
    csv = csv + 'Original Data Source: Emergency Department Database from the California Office of Statewide Health Planning and Development 2005-2012';
    csv = csv + '\n';
    csv = csv + 'Rates were obtained from the Environmental Health Investigations Branch of CDPH'
    csv = csv + '\n';

    // Add Column names as first row
    for(var i = 0; i < csv_labels.length; i++){

        csv = csv + csv_labels[i];

        // Append , or \n as needed
        if( i < csv_labels.length - 1){
            csv = csv + ',';
        } else {
            csv = csv + '\n';
        }
    }

    // Add rows
    for( key in jsonData ){
        var d = jsonData[key];
        var row = '';

        // Add county or zip name, use good county if exists
        var key_name = null;
        if( countyNames[key] ){
            key_name = countyNames[key]; // get good county name (listed bottom of file)
        } else {
            key_name = key;
        }
        row = row + key_name + ',';

        // Append data in order or cscv_keys, which matches label order
        for( var k = 0; k < csv_keys.length; k++ ){
            csv_k = csv_keys[k];

            // if there is a value, output value
            if( d[csv_k] != null ){
                row = row + d[csv_k];
            }

            // Append , or \n as needed
            if( k < csv_keys.length - 1){
                row = row + ',';
            } else {
                row = row + '\n';
            }
        }
        // Add row to csv string
        csv = csv + row;
    }

    // Data URI for download
    csv = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);

    return csv;
}

/*------------------------------------------------------------------------------
    :: Storage
------------------------------------------------------------------------------*/

var countyNames = {
    alameda: "Alameda",
    alpine: "Alpine",
    amador: "Amador",
    butte: "Butte",
    calaveras: "Calaveras",
    colusa: "Colusa",
    contra_costa: "Contra Costa",
    del_norte: "Del Norte",
    el_dorado: "El Dorado",
    fresno: "Fresno",
    glenn: "Glenn",
    humboldt: "Humboldt",
    imperial: "Imperial",
    inyo: "Inyo",
    kern: "Kern",
    kings: "Kings",
    lake: "Lake",
    lassen: "Lassen",
    los_angeles: "Los Angeles",
    madera: "Madera",
    marin: "Marin",
    mariposa: "Mariposa",
    mendocino: "Mendocino",
    merced: "Merced",
    modoc: "Modoc",
    mono: "Mono",
    monterey: "Monterey",
    napa: "Napa",
    nevada: "Nevada",
    orange: "Orange",
    placer: "Placer",
    plumas: "Plumas",
    riverside: "Riverside",
    sacramento: "Sacramento",
    san_benito: "San Benito",
    san_bernardino: "San Bernardino",
    san_diego: "San Diego",
    san_francisco: "San Francisco",
    san_joaquin: "San Joaquin",
    san_luis_obispo: "San Luis Obispo",
    san_mateo: "San Mateo",
    santa_barbara: "Santa Barbara",
    santa_clara: "Santa Clara",
    santa_cruz: "Santa Cruz",
    shasta: "Shasta",
    sierra: "Sierra",
    siskiyou: "Siskiyou",
    solano: "Solano",
    sonoma: "Sonoma",
    stanislaus: "Stanislaus",
    sutter: "Sutter",
    tehama: "Tehama",
    trinity: "Trinity",
    tulare: "Tulare",
    tuolumne: "Tuolumne",
    ventura: "Ventura",
    yolo: "Yolo",
    yuba: "Yuba",
}