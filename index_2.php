<?php
$rootUrl = 'http://localhost/chcf/';
// $rootUrl = 'http://chcf.idmstage.com/r1.2/';

require_once('lib/get_data.php');

/* Get data from APIs
------------------------------------------------------------------------------*/
// Get `county` data from API and format for JSON
$featureDataCounty = get_api_feature_data('county');
$jsonDataCounty = get_json_from_feature_data($featureDataCounty, 'county');
$minMaxCounty = get_min_max_of_data($featureDataCounty);

// Get `zip` data from API and format for JSON
$featureDataZip = get_api_feature_data('zip');
$jsonDataZip = get_json_from_feature_data($featureDataZip, 'zip');
$minMaxZip = get_min_max_of_data($featureDataZip);


/* Get combo max for rates from both zip and county data
------------------------------------------------------------------------------*/
$real_rate_max = compare_rate_max($minMaxCounty, $minMaxZip);

$minMaxCounty['rate']['max'] = $real_rate_max;
$minMaxZip['rate']['max'] = $real_rate_max;

/* Make JSON data
------------------------------------------------------------------------------*/
$minMaxCounty = json_encode($minMaxCounty);
$minMaxZip = json_encode($minMaxZip);

?>


<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>CHCF Round 1.3</title>
    <meta name='viewport' content='initial-scale=1,maximum-scale=1,user-scalable=no' />

    <!-- Bootstrap 3 / Google Fonts -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
    <link href='http://fonts.googleapis.com/css?family=Open+Sans:400,400italic,700,300' rel='stylesheet' type='text/css'>
    <!-- MapBox -->
    <link rel="stylesheet" href="https://api.tiles.mapbox.com/mapbox.js/v2.2.1/mapbox.css" rel="stylesheet" />
    <!-- CHCF -->
    <link rel="stylesheet" href="css/stackicons/css/stackicons-social-minimal.min.css">
    <link rel="stylesheet" href="css/style.css" />
</head>

<body>



<script type="text/javascript" src="https://code.jquery.com/jquery-1.11.3.min.js"></script>
<script type="text/javascript" src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>

<script src="js/resources/d3.min.js"></script>
<script src="js/resources/topojson.v1.min.js"></script>
<script type="text/javascript" src="js/ca-counties.js"></script>

<script type="text/javascript"></script>

</body>
</html>