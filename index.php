<?php
require_once('lib/get_data.php');

// Get `county` data from API and format for JSON
$featureDataCounty = get_api_feature_data('county');
$jsonDataCounty = get_json_from_feature_data($featureDataCounty, 'county');
$minMaxCounty = get_min_max_of_data($featureDataCounty);

// Get `zip` data from API and format for JSON
$featureDataZip = get_api_feature_data('zip');
$jsonDataZip = get_json_from_feature_data($featureDataZip, 'zip');
$minMaxZip = get_min_max_of_data($featureDataZip);

?>


<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>CHCF Round 1.1</title>
    <meta name='viewport' content='initial-scale=1,maximum-scale=1,user-scalable=no' />

    <!-- Bootstrap 3 -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
    <!-- MapBox -->
    <link rel="stylesheet" href="https://api.tiles.mapbox.com/mapbox.js/v2.2.1/mapbox.css" rel="stylesheet" />
    <!-- CHCF -->
    <link rel="stylesheet" href="css/stackicons/css/stackicons-social-minimal.min.css">
    <link rel="stylesheet" href="css/style.css" />
</head>

<body>

<nav class="navbar navbar-inverse">
    <div class="container">
        <!-- Brand and toggle get grouped for better mobile display -->
        <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="#">Health Indicators Dashboard</a>
        </div>

        <!-- Collect the nav links, forms, and other content for toggling -->
        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul class="nav navbar-nav">
                <li><a href="#">Overview</a></li>
                <li class="active"><a href="#">Indicators <span class="sr-only">(current)</span></a></li>
                <li><a href="#">Data</a></li>
                <li><a href="#">About</a></li>
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
                    <div class="indicator_dropdown">
                        <span class="pull-left">Indicator</span>
                        <form>
                            <select class="form-control">
                                <option>Asthma Emergency Department Visits</option>
                                <option>Indicator 2</option>
                                <option>Indicator 3</option>
                                <option>Indicator 4</option>
                                <option>Indicator 5</option>
                                <option>Indicator 6</option>
                                <option>Indicator 7</option>
                            </select>
                        </form>
                    </div>
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
            <p class="intro">Data needs a story. A reason for exisitng. Start each indicator with a compelling indroduction to why it's important, how it's used, and how it relates to other data sets.</p>
            <p>Asthma is a complicated disease and requires a multifaceted approach to reduce its burden on the people of California.</p>
            <p>When I wrote the following pages, or rather the bulk of them, I lived alone, in the woods, a mile from any neighbor, in a house which I had built myself, on the shore of Walden Pond, in Concord, Massachusetts, and earned my living by the labor of my hands only. I lived there two years and two months. At present I am a sojourner in civilized life again.</p>
        </div>
        <div class="col-sm-3">
            <div class="number_box">
                <ul>
                    <li>
                        <div class="text">Asthma Patients</div>
                        <div class="number">2.034<span>mil</span></div>
                    </li>
                    <li>
                        <div class="text">Total ED Visits</div>
                        <div class="number">348</div>
                    </li>
                    <li>
                        <div class="text">Visits Per Day</div>
                        <div class="number">8,382</div>
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
    
    <div class="row">
        <div class="col-sm-11 col-sm-offset-1">
            <p class="intro">Continue to layer up the sotry. Visitors need to be guided through the data and what it all means. Start hight level and dive deeper into specific components.</p>
            <p>Instructions for even simple tools are highly recommended. Users stop using when they get confused even for a moment. Tool tips next tot key elements help as well. use the filter controls below to update the map.</p>
        </div>
    </div>

    <div class="row">
        <div class="col-sm-12">
            <div class="map_wrap">
                <div class="map_title">
                    <h2>Asthma Emergecy Department Visits</h2>
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
                        <p><em>No counties selected.</em></p>
                        <div id="selected"></div>
                    </div>

                    <a class="download btn btn-success btn-sm" href="#">
                        <span class="glyphicon glyphicon-download"></span> Download Data
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
    
    <div class="row">
        <div class="col-sm-11 col-sm-offset-1">
            <p class="intro">Geography is important for making the data personal and relateable, but it doesn't tell the full story. Start to zero in on where we are compared to where we need to be.</p>
        </div>
    </div>

    <div class="row">
        <div class="col-sm-11 col-sm-offset-1">
            <div class="histogram">
                <form id="histogram_form" class="form-inline">
                    <h3>Options</h3>
                    <select class="form-control" name="map">
                        <option value="county">
                            County Map
                        </option>
                        <option value="zip">
                            Zip Code Map
                        </option>
                    </select>
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
                    <button class="btn btn-primary" type="submit">Update</button>
                </form>
                <div class="histogram_svg"></div>
            </div>
            <img style="width: 100%; height: auto; margin: 50px 0;" src="img/histogram.png" />
        </div>
    </div>

    <div class="row">
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
    </div>
</section>
<!-- .section_context -->

<script type="text/javascript" src="https://code.jquery.com/jquery-1.11.3.min.js"></script>
<script type="text/javascript" src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
<script src='https://api.tiles.mapbox.com/mapbox.js/v2.2.1/mapbox.js'></script>
<script src='https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-omnivore/v0.2.0/leaflet-omnivore.min.js'></script>
<!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.6/d3.min.js" charset="utf-8"></script> -->
<script type="text/javascript" src="js/ca-counties.js"></script>
<script type="text/javascript" src="data/2009_by_zipcode.js"></script>
<script type="text/javascript" src="js/mapbox_script.js"></script>
<script type="text/javascript" src="js/main.js"></script>

<script type="text/javascript">

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