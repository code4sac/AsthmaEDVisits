<?php

/*------------------------------------------------------------------------------
    :: Make API call to Socrata portal to get source data
------------------------------------------------------------------------------*/

require_once('lib/socrata.php');

function get_api_feature_data($map){
    // $root_url = 'https://cdph.data.ca.gov';
    // $view_uid = 'b35e-g7k2';

    $site_folder = 'chcf-r1-1';
    // $site_folder = 'r1.2';

    $root_url = 'https://opendata.socrata.com';
    $app_token = '3hGsRhGZ89RPrTg0bByaNkrZy';

    switch( $map ){
        case 'county':
            $view_uid = 'k9aw-e87g';
            break;
        case 'zip':
            $view_uid = 'k9aw-e87g';
            break;
        default:
            $view_uid = 'k9aw-e87g';
            break;
    }

    if( $map == 'county' ){
        $socrata = new Socrata($root_url, $app_token);
        $params = array();

        $feature_data = $socrata->get("/resource/$view_uid.json", $params);        
    }

    // TEMPORARY FOR LOCAL ZIP JSON -- DELETE AFTER API IS AVAILABLE
    if( $map == 'zip' ){
        $file  = 'http://' . $_SERVER['HTTP_HOST'] . '/';
        $file .= $site_folder . '/data/2009_by_zipcode.json';
        $feature_data = json_decode(file_get_contents($file), true);
    }

    return $feature_data;
}

/*------------------------------------------------------------------------------
    :: Process Data
------------------------------------------------------------------------------*/

/* Return a JSON array suitable for use with MapBox
 *
*/
function get_json_from_feature_data($feature_data, $map){

    $data = array();
    $i = 0;

    // Build $data array
    foreach( $feature_data as $d ) {
        $i += 1;

        // Array keys
        $geography = $d['geography'];
        $geography = slugify($geography);
        $year = $d['year'];

        // Data
        if( $d['geography'] != 'CALIFORNIA'){
            try {
                $number_0_17 = $d['number_0_17'];
            } catch (Exception $e) {
                $number_0_17 = '';
            }
            try {
                $number_18_plus = $d['number_18_plus'];
            } catch (Exception $e) {
                $number_18_plus = '';
            }
            try {
                $number_all_ages = $d['number_all_ages'];
            } catch (Exception $e) {
                $number_all_ages = '';
            }
            try {
                $rate_0_17 = $d['rate_0_17'];
            } catch (Exception $e) {
                $rate_0_17 = '';
            }
            try {
                $rate_18_plus = $d['rate_18_plus'];
            } catch (Exception $e) {
                $rate_18_plus = '';
            }
            try {
                $rate_all_ages = $d['rate_all_ages'];
            } catch (Exception $e) {
                $rate_all_ages = '';
            }

            $array = array(
                'number_0_17' => $number_0_17,
                'number_18_plus' => $number_18_plus,
                'number_all_ages' => $number_all_ages,
                'rate_0_17' => $rate_0_17,
                'rate_18_plus' => $rate_18_plus,
                'rate_all_ages' => $rate_all_ages,
                'year' => $year,
            );

            $data[$geography] = $array;

        }
    }

    $jsonData = json_encode($data);

    return $jsonData;
}

/*------------------------------------------------------------------------------
    :: Min Max Values for Legend
------------------------------------------------------------------------------*/

function get_min_max_of_data($feature_data){

    $number_0_17 = array();
    $number_18_plus = array();
    $number_all_ages = array();
    $rate_0_17 = array();
    $rate_18_plus = array();
    $rate_all_ages = array();

    foreach( $feature_data as $d ){

        if( $d['geography'] != 'CALIFORNIA'){
            // Data
            try {
                $val = $d['number_0_17'];
                if( $val != null ){ array_push($number_0_17, $val);}
            } catch (Exception $e) {
                // pass
            }
            try {
                $val = $d['number_18_plus'];
                if( $val != null ){ array_push($number_18_plus, $val);}
            } catch (Exception $e) {
                // pass
            }
            try {
                $val = $d['number_all_ages'];
                if( $val != null ){ array_push($number_all_ages, $val);}
            } catch (Exception $e) {
                // pass
            }
            try {
                $val = $d['rate_0_17'];
                if( $val != null ){ array_push($rate_0_17, $val);}
            } catch (Exception $e) {
                // pass
            }
            try {
                $val = $d['rate_18_plus'];
                if( $val != null ){ array_push($rate_18_plus, $val);}
            } catch (Exception $e) {
                // pass
            }
            try {
                $val = $d['rate_all_ages'];
                if( $val != null ){ array_push($rate_all_ages, $val);}
            } catch (Exception $e) {
                // pass
            }
        }
    }

    // Get max of each column
    $number_0_17 = max($number_0_17);
    $number_18_plus = max($number_18_plus);
    $number_all_ages = max($number_all_ages);
    $rate_0_17 = max($rate_0_17);
    $rate_18_plus = max($rate_18_plus);
    $rate_all_ages = max($rate_all_ages);

    // Get max values of each group
    $rate_max = max(array($rate_0_17, $rate_18_plus, $rate_all_ages));
    $number_max = max(array($number_0_17, $number_18_plus));
    $number_all_max = $number_all_ages;

    // Max array
    // Number/count array is extra level deep to accommodate a max between
    // 0-17 and 18+, and a max of all ages since all ages is sum of 0-17 and 18+
    $minMax = array(
        'rate' => array(
            'min' => 0,
            'max' => pad_max_value($rate_max),
        ),
        'number' => array(
            '0' => array(
                'min' => 0,
                'max' => pad_max_value($number_max),
            ),
            '18' => array(
                'min' => 0,
                'max' => pad_max_value($number_max),
            ),
            'all' => array(
                'min' => 0,
                'max' => pad_max_value($number_all_max),
            ),
        ),
    );

    return json_encode($minMax);
}


/*------------------------------------------------------------------------------
    :: Helpers
------------------------------------------------------------------------------*/

function pad_max_value($max){
    $max = floor($max);
    if( $max % 10 == 0 ){
        $max += 10; // make 10 larger if already a 10
    } else {
        $max = ceil($max/10)*10; // round up to nearest 10
    }
    return $max;
}

function slugify($text){
    $text = strtolower($text);
    $text = preg_replace('~[^-\w]+~', '_', $text);

    return $text;
}

