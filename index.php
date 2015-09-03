<?php
$rootUrl = 'http://localhost/chcf/';
// $rootUrl = 'http://chcf.idmstage.com/r1.2/';

// Set `$slide` for social share and jump to slide
// - slide value used in `head.php`
if( isset($_GET['slide']) ){
    $slide = $_GET['slide'];
} else {
    $slide = 0;
}
?>


<?php require_once('includes/head.php'); ?>


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
<section class="overview">
<a class="named_anchor" name="overview">&nbsp;</a>

    <?php require_once('includes/section_overview.php') ?>

</section>
<!-- .section_context -->



<!-- Map -->
<section class="map">
<a class="named_anchor" name="section_map">&nbsp;</a>

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
                            <select class="form-control" name="map">
                                <option value="county">
                                    County Map
                                </option>
                                <option value="zip">
                                    Zip Code Map
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
<section class="container section_context">
<a class="named_anchor" name="section_context">&nbsp;</a>

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


<?php require_once('includes/section_resources_footer.php'); ?>


<script type="text/javascript" src="https://code.jquery.com/jquery-1.11.3.min.js"></script>
<script type="text/javascript" src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
<script src='https://api.tiles.mapbox.com/mapbox.js/v2.2.1/mapbox.js'></script>
<script src='https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-omnivore/v0.2.0/leaflet-omnivore.min.js'></script>

<script src="js/resources/d3.min.js"></script>
<script src="js/resources/bxslider/jquery.bxslider.min.js"></script>
<script type="text/javascript" src="js/ca-counties.js"></script>
<script type="text/javascript" src="data/emergency_department_rates__county.js"></script>
<script type="text/javascript" src="data/emergency_department_rates__zip.js"></script>

<script type="text/javascript" src="js/utils.js"></script>
<script type="text/javascript" src="js/mapbox_script.js"></script>
<script type="text/javascript" src="js/slides.js"></script>
<script type="text/javascript" src="js/main.js"></script>

<script type="text/javascript">

    var rootUrl = <?php echo '"' . $rootUrl . '"'; ?>;

    var maxRate = 155.5;

    jQuery(document).ready(function(){
        CHCF.dataMapInit();
        // Histogram.init();
    });

</script>

</body>
</html>