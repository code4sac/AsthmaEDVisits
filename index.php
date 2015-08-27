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


<?php require_once('lib/head.php'); ?>



<section class="intro">
    <div class="container">
        <div class="row">
            <div class="col-sm-10 col-sm-offset-2">
                <h1><span>California</span> Asthma Emergency Department Visits</h1>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-2">
                <div class="quick_links">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><a href="#overview">Overview &raquo;</a></li>
                        <li><a href="#map">Interactive Map &raquo;</a></li>
                        <li><a href="#resources">Resources &raquo;</a></li>
                    </ul>
                </div>
            </div>
            <div class="col-sm-10">
                <p class="lead">Asthma is one of the most common chronic diseases and recognized as a growing public health concern.</p>
                <p>The effects of asthma include missed school and work days, disruption of sleep and daily activities, urgent medical visits for asthma exacerbations, and even death. Asthma affects not only those with the disease but also their family members and friends, as well as schools and businesses. There is no cure for asthma, but symptoms can be controlled with access to medical care, appropriate medications, proper self-management, and trigger reduction. When asthma is controlled, people can lead normal lives and achieve their goals.</p>
            </div>
        </div>
    </div>
</section>



<!-- Overview -->
<a class="named_anchor" name="overview">&nbsp;</a>
<section class="overview">

    <h2><span>Overview</span></h2>
    
    <div class="row">
        <div class="col-sm-8 col-sm-offset-1">
            <p class="">Asthma is one of the most common chronic diseases and has been recognized as a growing public health concern. The effects of asthma include missed school and work days, disruption of sleep and daily activities, urgent medical visits for asthma exacerbations, and even death. Asthma affects not only those with the disease but also their family members and friends, as well as schools and businesses. There is no cure for asthma, but symptoms can be controlled with access to medical care, appropriate medications, proper self-management, and trigger reduction. When asthma is controlled, people can lead normal lives and achieve their goals.</p>
            <p>Learn more about asthma in California, it's burden on our state and plans for reducing its impact at <a href="http://www.californiabreathing.org" target="_blank">CaliforniaBreathing.org</a>.</p>
        </div>
        <div class="col-sm-3">
            <div class="number_box">
                <h3>2012 ED Visits</h3>
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
<section class="map">

    <div class="container">
        <div class="row">
            <div class="col-sm-9">
                <h2><span>Interactive</span> Asthma Rates by Geography</h2>
                <p>The map below shows 2012 Emergency Department visit rates for California counties and zip codes. Use the options on the side to toggle between age groups and map type. You can download the full data set, or select individual counties/zips to download.</p>
            </div>
        </div>

        <div class="row">
            <div class="col-sm-12">

                <div class="map_wrap">
                    <div class="map_title">
                        <div class="title">2012 ED Visits</div>
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
                </div><!-- .map_wrap -->

            </div>
        </div><!-- .row -->
    </div><!-- .container -->
</section>





<!-- Context -->
<a class="named_anchor" name="section_context">&nbsp;</a>
<section class="container section_context">

    <h2><span>Context</span></h2>
    
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
</section>
<!-- .section_context -->




<!-- Resources -->
<a class="named_anchor" name="resources">&nbsp;</a>
<section class="resources">

    <div class="container">
        <div class="row">
            <div class="col-sm-12">
                <h2><span>Resources</span> Where Do I Go From Here?</h2>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-4">
                <h3>Asthma Treatment</h3>
                <p><strong>Did you know</strong>: A written asthma action plan from a health care provider can help you manage your symptoms and reduce the risk of emergency department visits or hospitalization by <strong>XX%</strong>, but only about <strong>40%</strong> of people experiencing asthma have ever received one.<p>
                <p>Experiencing asthma symptoms? <a href="#">Contact your health care provider</a>.<p>
                <p>Uninsured? <a href="#">Get signed up</a>.<p>
            </div>
            <div class="col-sm-4">
                <h3>Plans and Solutions</h3>
                <p><strong>Did you know</strong>: Asthma causes <strong>11.8 million</strong> missed work days and <strong>1.2 million</strong> missed school and daycare days in California annually, and asthma hospitalizations cost over <strong>$1 billion</strong> in California per year.<p>
                <p>Want to know what California’s doing about it? <a href="#">Check out the state’s Strategic Plan for Asthma</a>.<p>
                <p>Want to talk to an expert? <a href="#">Contact the California Breathing team</a>.<p>
            </div>
            <div class="col-sm-4">
                <h3>Data Sets</h3>
                <p><strong>Did you know</strong>: The CHHS Open Data Portal contains much of the data used for this site, along with a host of other datasets covering medical facility performance, other public health indicators, and social services delivery.<p>
                <p>Want to access the state’s data? <a href="#">Check it out</a>.<p>
                <p>Need other asthma data? Check out <a href="#">AskCHIS</a>, <a href="#">BRFSS</a>, the <a href="#">US Census</a>, and <a href="#">California Breathing</a>.<p>
            </div>
        </div>
    </div>

</section>
<!-- .section_context -->


<footer>
    <div class="container">
        <div class="row">
            <div class="col-sm-12">
                <div class="copyright">Asthma Emergency Department Visits</div>
            </div>
        </div>
    </div>
</footer>












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