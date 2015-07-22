<?php
require_once('lib/socrata.php');

/* Return a JSON array suitable for use with MapBox
 *
*/
function get_json_data_from_api($feature_data, $map){

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
        } else {
            echo $d['county'];
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
    $number_max = max(array($number_0_17, $number_18_plus, $number_all_ages));

    // Max array
    $minMax = array(
        'rate' => array(
            'min' => 0,
            'max' => pad_max_value($rate_max)
        ),
        'number' => array(
            'min' => 0,
            'max' => pad_max_value($number_max),
        )
    );

    // $minMax = array(
    //     'number_0_17' => array(
    //         'min' => min($number_0_17),
    //         'max' => pad_max_value($number_0_17),
    //     ),
    //     'number_18_plus' => array(
    //         'min' => min($number_18_plus),
    //         'max' => pad_max_value($number_18_plus),
    //     ),
    //     'number_all_ages' => array(
    //         'min' => min($number_all_ages),
    //         'max' => pad_max_value($number_all_ages),
    //     ),
    //     'rate_0_17' => array(
    //         'min' => min($rate_0_17),
    //         'max' => pad_max_value($rate_0_17),
    //     ),
    //     'rate_18_plus' => array(
    //         'min' => min($rate_18_plus),
    //         'max' => pad_max_value($rate_18_plus),
    //     ),
    //     'rate_all_ages' => array(
    //         'min' => min($rate_all_ages),
    //         'max' => pad_max_value($rate_all_ages),
    //     ),
    // );

    return json_encode($minMax);
}

/*------------------------------------------------------------------------------
    :: Make API call to Socrata portal to get source data
------------------------------------------------------------------------------*/

function get_api_feature_data($map){
    // $root_url = 'https://cdph.data.ca.gov';
    // $view_uid = 'b35e-g7k2';
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

    $socrata = new Socrata($root_url, $app_token);
    $params = array();

    $feature_data = $socrata->get("/resource/$view_uid.json", $params);

    return $feature_data;
}

/*------------------------------------------------------------------------------
    :: Helpers
------------------------------------------------------------------------------*/

function pad_max_value($max){
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

