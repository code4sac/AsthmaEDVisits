/*------------------------------------------------------------------------------
    :: Main Init / Controller
------------------------------------------------------------------------------*/

var CHCF = {
    dataMapInit: function(){

        var $window = jQuery(window);

        // MapBox map init
        MBox.init(jsonDataCounty, jsonDataZip, maxRate, hashValues); // jsonData via index.php

        // Slides init
        slideShow(jsonDataCounty, jsonDataZip, maxRate, GET_slide);

        // Top nav download button
        $main_download = jQuery('.navbar .download a');
        $main_download.on('click', function(){

            var data = jQuery.extend(jsonDataCounty, jsonDataZip);
            var csvData = make_csv_data(data); // utils.js

            filename = 'AsthmaEDRates_county_and_zip.csv';

            $(this)
                .attr({
                'download': filename,
                'href': csvData,
                'target': '_blank'
            });

        });


        /* Window Resize
        ----------------------------------------------------------------------*/

        $window.resize(function(){
            var win_width = jQuery(window).width();
        });
    }
}

/*------------------------------------------------------------------------------
    :: Reference
------------------------------------------------------------------------------*/

var column_names = {
    '0': 'rate_0',
    '18': 'rate_18',
    'all': 'rate_all',
}

/*------------------------------------------------------------------------------
    :: Misc.
------------------------------------------------------------------------------*/

/* Scroll to named anchor
 * https://css-tricks.com/snippets/jquery/smooth-scrolling/
*/
$(function() {
    $('a[href*=#]:not([href=#])').click(function() {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
            if (target.length) {
                $('html,body').animate({
                    scrollTop: target.offset().top
                }, 1000);
                return false;
            }
        }
    });
});
