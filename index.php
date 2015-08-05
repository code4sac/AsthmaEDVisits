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

<nav class="navbar nav-fixed">
    <div class="container">
        <!-- Brand and toggle get grouped for better mobile display -->
        <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="http://californiabreathing.org/">CaliforniaBreathing.org</a>
        </div>

        <!-- Collect the nav links, forms, and other content for toggling -->
        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul class="nav navbar-nav">
<!--
                <li class="active"><a href="#section_overview">Overview</a></li>
                <li><a href="#section_map">Geography</a></li>
                <li><a href="#section_context">Context</a></li>
 -->
            </ul>
        </div><!-- /.navbar-collapse -->
    </div><!-- /.container-fluid -->
</nav>



<div class="main_title_nav">
    <div class="container">
        <div class="row">
            <div class="col-sm-12">
                <div class="main_title_wrap">
                    <h1>Asthma Emergency Department Visits</h1>
                    <div class="subnav">
                        <ul class="nav nav-pills">
                            <li class="active"><a href="#section_overview">Overview</a></li>
                            <li><a href="#section_map">Geography</a></li>
                            <li><a href="#section_context">Context</a></li>
                        </ul>
                        <a class="download btn btn-success btn-sm" href="#"><span class="glyphicon glyphicon-download"></span> Download Data</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>



<!-- Overview -->
<a class="named_anchor" name="section_overview">&nbsp;</a>
<section class="container section_overview">

    <div class="section_title"><span>Overview</span></div>
    
    <div class="row">
        <div class="col-sm-8 col-sm-offset-1">
            <p class="">Asthma is one of the most common chronic diseases and has been recognized as a growing public health concern. The effects of asthma include missed school and work days, disruption of sleep and daily activities, urgent medical visits for asthma exacerbations, and even death. Asthma affects not only those with the disease but also their family members and friends, as well as schools and businesses. There is no cure for asthma, but symptoms can be controlled with access to medical care, appropriate medications, proper self-management, and trigger reduction. When asthma is controlled, people can lead normal lives and achieve their goals.</p>
            <p>Learn more about asthma in California, it's burden on our state and plans for reducing its impact at <a href="http://www.californiabreathing.org" target="_blank">CaliforniaBreathing.org</a>.</p>
        </div>
        <div class="col-sm-3">
            <div class="number_box">
                <h3>2012 ED Vistits</h3>
                <ul>
                    <li>
                        <div class="number">145,360</div>
                        <div class="text">Total ED Visits</div>
                    </li>
                    <li>
                        <div class="number">74.02</div>
                        <div class="text">Average Rate Per 10,000,<br />Age 0-17</div>
                    </li>
                    <li>
                        <div class="number">28</div>
                        <div class="text">2022 Target Rate Per 10,000,<br />Ages 0-17</div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</section>
<!-- .section_context -->



<!-- Map -->
<a class="named_anchor" name="section_map">&nbsp;</a>
<section class="container section_map">

    <div class="section_title"><span>Geography</span></div>
    
<!--     <div class="row">
        <div class="col-sm-11 col-sm-offset-1">
            <p class="intro">Continue to layer up the sotry. Visitors need to be guided through the data and what it all means. Start hight level and dive deeper into specific components.</p>
            <p>Instructions for even simple tools are highly recommended. Users stop using when they get confused even for a moment. Tool tips next tot key elements help as well. use the filter controls below to update the map.</p>
        </div>
    </div> -->

    <div class="row">
        <div class="col-sm-12">
            <div class="map_wrap">
                <div class="map_title">
                    <h2>2012 Asthma Emergecy Department Visits</h2>
                    <div class="social">
                        <a href="#" class="st-icon-facebook-alt st-icon-circle">Facebook</a>
                        <a href="#" class="st-icon-twitter st-icon-circle">Twitter</a>
                    </div>
                </div>
                <div id="map"></div>

                <div id="map_form">
                    <h3>Options</h3>
                    <form id="mapForm" method="GET">
                        <select class="form-control" name="values">
                            <option value="rate">
                                Rate Per 10,000
                            </option>
                            <option value="number">
                                Number of Visits
                            </option>
                        </select>
                        <select class="form-control" name="ages">
                            <option value="0">
                                Ages 0&ndash;17
                            </option>
                            <option value="18">
                                Ages 18+
                            </option>
                            <option value="all">
                                All Ages
                            </option>
                        </select>
                        <select class="form-control" name="map">
                            <option value="county">
                                County Map
                            </option>
                            <option value="zip">
                                Zip Code Map
                            </option>
                        </select>
                        <!-- <button class="btn btn-primary btn-block">Updated Map</button> -->
                    </form>

                    <div class="selected_wrap">
                        <h3>Selected</h3>
                        <p><em>No areas selected.</em></p>
                        <div id="selected"></div>
                    </div>

                    <a class="download btn btn-success btn-sm" href="#">
                        <span class="glyphicon glyphicon-download"></span> Download Selected Data
                    </a>
                </div>
            </div>
        </div>
    </div>

</section>
<!-- .section_context -->




<!-- Context -->
<a class="named_anchor" name="section_context">&nbsp;</a>
<section class="container section_context">

    <div class="section_title"><span>Context</span></div>
    
<!--     <div class="row">
        <div class="col-sm-11 col-sm-offset-1">
            <p class="intro">Geography is important for making the data personal and relateable, but it doesn't tell the full story. Start to zero in on where we are compared to where we need to be.</p>
        </div>
    </div> -->

    <div class="row">
        <div class="col-sm-11 col-sm-offset-1">
            <div class="histogram">
                <div class="row">
                    <div class="col-sm-8">
                        <form id="histogram_form" class="form-inline">
                            <h3>Options</h3>
                            <select class="form-control" name="map">
                                <option value="county" selected>
                                    County
                                </option>
                                <option value="zip" >
                                    Zip Code
                                </option>
                            </select>
                            <select class="form-control" name="values">
                                <option value="rate" selected>
                                    Rate Per 10,000
                                </option>
                                <option value="number">
                                    Number of Visits
                                </option>
                            </select>
                            <select class="form-control" name="ages">
                                <option value="0" selected>
                                    Ages 0&ndash;17
                                </option>
                                <option value="18" >
                                    Ages 18+
                                </option>
                                <option value="all" >
                                    All Ages
                                </option>
                            </select>
                        </form>

                        <div id="histogram_svg"></div>

                    </div>
                    <div class="col-sm-4">
                        <div class="histogram_stats rate">
                            <div class="rate_stats">
                                <div class="on_target">
                                    <h3>On Target</h3>
                                    <div class="number number_on"></div>
                                    <div class="number_label">Number on Target</div>
                                    <div class="number average_rate"></div>
                                    <div class="number_label">Average Rate<sup>*</sup></div>
                                    <div class="number average_total"></div>
                                    <div class="number_label">Average Total</div>
                                </div>
                                <div class="off_target">
                                    <h3>Off Target</h3>
                                    <div class="number number_on"></div>
                                    <div class="number_label">Number on Target</div>
                                    <div class="number average_rate"></div>
                                    <div class="number_label">Average Rate<sup>*</sup></div>
                                    <div class="number average_total"></div>
                                    <div class="number_label">Average Total</div>
                                </div>
                                <div class="footnotes">
                                    <sup>*</sup>Rate is only available calculable for counties and zip codes with at least 12 ED visits in a year.
                                </div>
                            </div>
                            <div class="number_stats">
                                <h3>Number of ED Visits</h3>
                                <div class="number average_total"></div>
                                <div class="number_label">Average Number of Visits</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

<!--     <div class="row">
        <div class="col-sm-11 col-sm-offset-1">
            <div class="row">
                <div class="col-sm-4">
                    <h3>Key Concept or Insight 1</h3>
                    <p>When I wrote the following pages, or rather the bulk of them, I lived alone, in the woods, a mile from any neighbor, in a house which I had built myself, on the shore of Walden Pond, in Concord, Massachusetts, and earned my living by the labor of my hands only. I lived there two years and two months. At present I am a sojourner in civilized life.</p>
                </div>
                <div class="col-sm-4">
                    <h3>Key Concept or Insight 1</h3>
                    <p>When I wrote the following pages, or rather the bulk of them, I lived alone, in the woods, a mile from any neighbor, in a house which I had built myself, on the shore of Walden Pond, in Concord, Massachusetts, and earned my living by the labor of my hands only. I lived there two years and two months. At present I am a sojourner in civilized life.</p>
                </div>
                <div class="col-sm-4">
                    <h3>Key Concept or Insight 1</h3>
                    <p>When I wrote the following pages, or rather the bulk of them, I lived alone, in the woods, a mile from any neighbor, in a house which I had built myself, on the shore of Walden Pond, in Concord, Massachusetts, and earned my living by the labor of my hands only. I lived there two years and two months. At present I am a sojourner in civilized life.</p>
                </div>
            </div>            
        </div>
    </div> -->

</section>
<!-- .section_context -->




<!-- Resources -->
<a class="named_anchor" name="section_resources">&nbsp;</a>
<section class="container section_resources">

    <div class="section_title"><span>Resources</span></div>

</section>
<!-- .section_context -->




<script type="text/javascript" src="https://code.jquery.com/jquery-1.11.3.min.js"></script>
<script type="text/javascript" src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
<script src='https://api.tiles.mapbox.com/mapbox.js/v2.2.1/mapbox.js'></script>
<script src='https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-omnivore/v0.2.0/leaflet-omnivore.min.js'></script>

<script src="js/resources/d3.min.js"></script>
<script type="text/javascript" src="js/ca-counties.js"></script>
<script type="text/javascript" src="js/utils.js"></script>
<script type="text/javascript" src="js/mapbox_script.js"></script>
<script type="text/javascript" src="js/main.js"></script>

<script type="text/javascript">

    var rootUrl = <?php echo '"' . $rootUrl . '"'; ?>;

    var jsonDataCounty = <?php echo $jsonDataCounty; ?>;
    var jsonDataZip = <?php echo $jsonDataZip; ?>;
    var minMaxCounty = <?php echo $minMaxCounty; ?>;
    var minMaxZip = <?php echo $minMaxZip; ?>;

    jQuery(document).ready(function(){
        CHCF.dataMapInit();
        Histogram.init();
    });

</script>

</body>
</html>