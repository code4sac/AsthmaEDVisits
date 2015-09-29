<?php
// $rootUrl = 'localhost/chscf/';
$rootUrl = 'http://www.asthmastoryca.org/';

/* Set `$slide` for social share and jump to slide
------------------------------------------------------------------------------*/
// - slide value used in `head.php` */

if( isset($_GET['slide']) ){
    $slide = $_GET['slide'];
    if( $slide < 1 || $slide >= 12 ){ // 12th slide is the "what's next" and should = 0
        $slide = 0;
    }
} else {
    $slide = 0;
}

/* GET for map settings
------------------------------------------------------------------------------*/

$map_hash = 'county0';
if( isset( $_GET['map']) ){
    $map_hash = $_GET['map'];
}

switch( $map_hash ){
    case 'county0':
        $age_setting = '0';
        $map_setting = 'county';
        break;
    case 'county18':
        $age_setting = '18';
        $map_setting = 'county';
        break;
    case 'countyall':
        $age_setting = 'all';
        $map_setting = 'county';
        break;
    case 'zip0':
        $age_setting = '0';
        $map_setting = 'zip';
        break;
    case 'zip18':
        $age_setting = '18';
        $map_setting = 'zip';
        break;
    case 'zipall':
        $age_setting = 'all';
        $map_setting = 'zip';
        break;
    default:
        $map_hash = 'county0';
        $age_setting = 0;
        $map_setting = 'county';
        break;
}

?>




<?php require_once('includes/head.php'); ?>


<section class="intro">
    <div class="container-fluid">
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
                <p>Emergency Department (ED) visit rates related to asthma are a leading indicator healthcare leaders use to track the effects of asthma, particularly on children 0-17 years old.</p> 

                <p>This project site provides an <a href="#section_overview">overview of key insights</a> contained within asthma ED visit rate datasets on the CHHS Open Data Portal and other sources. It also provides an <a href="#section_map">interactive map tool</a> to help visualize how asthma ED visit rates vary across the state.</p>
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

    var hashValues = {
        age: '<?php echo $age_setting ?>',
        map: '<?php echo $map_setting ?>'
    }

    jQuery(document).ready(function(){
        CHCF.dataMapInit();
    });

</script>

</body>
</html>