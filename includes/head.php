<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>Asthma Emergency Department Visits | California Health Care Foundation</title>
    <meta name='viewport' content='initial-scale=1,maximum-scale=1,user-scalable=no' />

    <!-- Bootstrap 3 / Google Fonts -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
    <link href='http://fonts.googleapis.com/css?family=Lato:400,400italic,700,300' rel='stylesheet' type='text/css'>
    <!-- MapBox -->
    <link rel="stylesheet" href="https://api.tiles.mapbox.com/mapbox.js/v2.2.1/mapbox.css" rel="stylesheet" />
    <!-- CHCF -->
    <link rel="stylesheet" href="css/stackicons/css/stackicons-social-minimal.min.css">
    <link rel="stylesheet" href="js/resources/bxslider/jquery.bxslider.css" />
    <link rel="stylesheet" href="css/style.css" />

    <?php require_once('includes/social_meta.php') ?>

</head>

<body>

<?php echo $fb_image ?>

<nav class="navbar nav-fixed">
    <div class="container">
        <!-- Brand and toggle get grouped for better mobile display -->
        <div class="navbar-header">
            <a class="navbar-brand" href="#">Asthma Emergency Department Visits</a>
        </div>

        <div class="social">
            <a href="http://facebook.com/sharer.php?u=<?php echo urlencode($rootUrl) ?>&amp;t=<?php echo urlencode('Asthma Emergency Department Visits in California') ?>" target="_blank" class="st-icon-facebook-alt st-icon-circle">Facebook</a>
            <a href="https://twitter.com/intent/tweet?url=<?php echo urlencode($rootUrl) ?>&amp;text=<?php echo urlencode('Asthma Emergency Department Visits in California') ?>&amp;via=<?php echo urldecode('CAHealthData') ?>" class="st-icon-twitter st-icon-circle" target="_blank">Twitter</a>
        </div>

        <div class="download">
            <a href="#"><span class="glyphicon glyphicon-download"></span> Download Data</a>
        </div>

    </div><!-- /.container-fluid -->
</nav>