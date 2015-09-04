<?php

$share = array(
    /* Default site cards
    --------------------------------------------------------------------------*/
    0 => array(
            'title' => 'Asthma Emergency Department Visits in CA',
            'description' => 'Asthma is one of the most common chronic diseases and a growing health concern in CA.',
            'tw_image' => 'share_0.png',
            'fb_image' => 'share_0.png',
        ),
    /* Slide specific cards
    --------------------------------------------------------------------------*/
    1 => array(
            'title' => 'Asthma Emergency Department Visits in CA',
            'description' => 'Asthma is one of the most common chronic diseases and a growing health concern in CA.',
            'tw_image' => 'share_0.png',
            'fb_image' => 'share_0.png',
        ),
    2 => array(
            'title' => 'How is Asthma Measured?',
            'description' => 'Surveys reveal that about 5 million Californians have asthma.',
            'tw_image' => 'share_0.png',
            'fb_image' => 'share_0.png',
        ),
    3 => array(
            'title' => 'Adult Asthma ED Visits in CA',
            'description' => 'In 2012, there were about 185,831 ED visits for asthma in California.',
            'tw_image' => 'share_0.png',
            'fb_image' => 'share_0.png',
        ),
    4 => array(
            'title' => 'CA Adult Asthma ED Visit Rates by County',
            'description' => 'Adult ED visit rates are somewhat higher in inland counties than in coastal counties.',
            'tw_image' => 'share_0.png',
            'fb_image' => 'share_0.png',
        ),
    5 => array(
            'title' => 'CA Youth Asthma ED Visit Rates by County',
            'description' => 'Youth asthma ED visit rates are higher and have more variation among areas.',
            'tw_image' => 'share_0.png',
            'fb_image' => 'share_0.png',
        ),
    6 => array(
            'title' => 'CA Youth Asthma ED Visit Rates by ZIP',
            'description' => 'ZIP Codes show distinctions among different areas for CA youth.',
            'tw_image' => 'share_0.png',
            'fb_image' => 'share_0.png',
        ),
    7 => array(
            'title' => 'CA Youth Asthma ED Visit Rates: Imperial Valley',
            'description' => 'Youth asthma ED visits are particularly high in the Imperial Valley.',
            'tw_image' => 'share_0.png',
            'fb_image' => 'share_0.png',
        ),
    8 => array(
            'title' => 'CA Youth Asthma ED Visit Rates: Los Angeles & Inland Empire',
            'description' => 'L.A. and Inland Empire rates show most variation within the same air basin.',
            'tw_image' => 'share_0.png',
            'fb_image' => 'share_0.png',
        ),
    9 => array(
            'title' => 'CA Youth Asthma ED Visit Rates: San Joaquin Valley',
            'description' => 'San Joaquin Valley has some of the highest rates of youth asthma ED visits.',
            'tw_image' => 'share_0.png',
            'fb_image' => 'share_0.png',
        ),
    10 => array(
            'title' => 'CA Youth Asthma ED Visit Rates: Bay Area',
            'description' => 'The San Francisco Bay Area reveals a pronounced difference among rates in different areas.',
            'tw_image' => 'share_0.png',
            'fb_image' => 'share_0.png',
        ),
    11 => array(
            'title' => 'Blacks Have Highest Asthma ED Visit Rates in CA',
            'description' => 'From 2005–2010, asthma ED visit rates among Blacks were 3–5 times higher than Whites.',
            'tw_image' => 'share_0.png',
            'fb_image' => 'share_0.png',
        ),
);

?>
        <!-- Twitter Card -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:site" content="@CAHealthData">
        <meta name="twitter:title" content="<?php echo $share[$slide]['title'] ?>">
        <meta name="twitter:description" content="<?php echo $share[$slide]['description'] ?>">
        <meta name="twitter:image" content="http://chcf.idmstage.com/r3.2/img/<?php echo $share[$slide]['tw_image'] ?>">
        <!-- Facebook Opengraph -->
        <meta property="og:site_name" content="California Health Care Foundation"/>
        <meta property="og:type" content="website"/>
        <meta property="og:title" content="<?php echo $share[$slide]['title'] ?>" />
        <meta property="og:url" content="http://chcf.idmstage.com/r3.2?slide=<?php echo $slide ?>" />
        <meta property="og:description" content="<?php echo $share[$slide]['description'] ?>" />
        <meta property="og:image" content="http://chcf.idmstage.com/r3.2/img/<?php echo $share[$slide]['fb_image'] ?>">

<?


/*

switch ( $slide ) {
    case 1: ?>
        <!-- Twitter Card -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:site" content="@CAHealthData">
        <meta name="twitter:title" content="Slide 1">
        <meta name="twitter:description" content="Asthma is one of the most common chronic diseases and recognized as a growing public health concern.">
        <meta name="twitter:image" content="http://chcf.idmstage.com/images/share_1.png">
        <!-- Facebook Opengraph -->
        <meta property="og:site_name" content="Asthma Emergency Department Visits in California | CA Health Data"/>
        <meta property="og:type" content="website"/>
        <meta property="og:title" content="Asthma Emergency Department Visits 1" />
        <meta property="og:url" content="http://chcf.idmstage.com/share_test.php?slide=1" />
        <meta property="og:description" content="Asthma is one of the most common chronic diseases and recognized as a growing public health concern." />
        <meta property="og:image" content="http://chcf.idmstage.com/images/share_1.png">

        <?php
        break;
    
    case 2: ?>
        <!-- Twitter Card -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:site" content="@CAHealthData">
        <meta name="twitter:title" content="Slide 2">
        <meta name="twitter:description" content="Asthma is one of the most common chronic diseases and recognized as a growing public health concern.">
        <meta name="twitter:image" content="http://chcf.idmstage.com/images/share_2.png">
        <!-- Facebook Opengraph -->
        <meta property="og:site_name" content="Asthma Emergency Department Visits in California | CA Health Data"/>
        <meta property="og:type" content="website"/>
        <meta property="og:title" content="Asthma Emergency Department Visits 2" />
        <meta property="og:url" content="http://chcf.idmstage.com/share_test.php?slide=2" />
        <meta property="og:description" content="Asthma is one of the most common chronic diseases and recognized as a growing public health concern." />
        <meta property="og:image" content="http://chcf.idmstage.com/images/share_2.png">

        <?php
        break;

    default: ?>
        <!-- Twitter Card -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:site" content="@CAHealthData">
        <meta name="twitter:title" content="Slide 0">
        <meta name="twitter:description" content="Asthma is one of the most common chronic diseases and recognized as a growing public health concern.">
        <meta name="twitter:image" content="http://chcf.idmstage.com/images/share_0.png">
        <!-- Facebook Opengraph -->
        <meta property="og:site_name" content="California Health Care Foundation"/>
        <meta property="og:type" content="website"/>
        <meta property="og:title" content="Asthma Emergency Department Visits 0" />
        <meta property="og:url" content="http://chcf.idmstage.com/share_test.php" />
        <meta property="og:description" content="Asthma is one of the most common chronic diseases and recognized as a growing public health concern." />
        <meta property="og:image" content="http://chcf.idmstage.com/images/share_0.png">

        <?php
        break;
}

*/

?>