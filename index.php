<?php
$rootUrl = 'http://localhost/chcf/';
// $rootUrl = 'http://chcf.idmstage.com/r3.2/';

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
                        <li><a href="#section_overview">Overview &raquo;</a></li>
                        <li><a href="#section_map">Interactive Map &raquo;</a></li>
                        <li><a href="#section_resources">Resources &raquo;</a></li>
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
<a class="named_anchor" name="section_overview">&nbsp;</a>

    <?php require_once('includes/section_overview.php') ?>

</section>
<!-- .section_context -->



<!-- Map -->
<section class="map">
<a class="named_anchor" name="section_map"></a>

    <?php require_once('includes/section_map.php') ?>

</section>


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
    var GET_slide = <?php echo $slide ?>;

    jQuery(document).ready(function(){
        CHCF.dataMapInit();
    });

</script>

</body>
</html>