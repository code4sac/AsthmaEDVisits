/*------------------------------------------------------------------------------
    :: Main Init / Controller
------------------------------------------------------------------------------*/

var CHCF = {
    dataMapInit: function(){

        var $window = jQuery(window);

        // Subnav                
        AffixNav.init($window.width());

        // $mapForm = jQuery('#mapForm');
        // $select_ages = $mapForm.find('select[name="ages"]');
        // $select_values = $mapForm.find('select[name="values"]');
        // var ages = $select_ages.val();
        // var values = $select_values.val();

        MBox.init(jsonDataCounty, jsonDataZip, minMaxCounty, minMaxZip); // jsonData via index.php

        $window.resize(function(){
            var win_width = jQuery(window).width();
            AffixNav.onResize(win_width);
        });
    }
}

/*------------------------------------------------------------------------------
    :: Sub Navigation
------------------------------------------------------------------------------*/

/* Floating navigation using Boostrap Affix.js
 * (included via Bootstrap.js)
*/
var AffixNav = {
    init: function(win_width){
        this.title_nav = jQuery('.main_title_nav');
        this.win_width = win_width;
        this.setAffix();
        this.onAffixedBsAffix();
        this.onAffixedTopBsAffix();
    },
    setAffix: function(){
        this.setWidth();
        this.title_nav.affix({
            offset: {
                top: 52,
                bottom: 200,
            }
        });
    },
    setWidth: function(){
        this.title_nav.css('width', this.win_width);
    },
    onAffixedBsAffix: function(){
        this.title_nav.on('affixed.bs.affix', function(event){
            jQuery('body').addClass('affixed');
        });
    },
    onAffixedTopBsAffix: function(){
        this.title_nav.on('affixed-top.bs.affix', function(event){
            jQuery('body').removeClass('affixed');
        });
    },
    onResize: function(win_width){
        this.title_nav.css('width', win_width);
    }
}

/*------------------------------------------------------------------------------
    :: Histogram
------------------------------------------------------------------------------*/

var Histogram = {
    init: function(){
        
    }
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
                jQuery('.main_title_wrap .nav-pills li').removeClass('active');
                jQuery(this).parent().addClass('active');
                return false;
            }
        }
    });
});