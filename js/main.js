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
    :: Reference
------------------------------------------------------------------------------*/

var column_names = {
    'number': {
        '0': 'number_0_17',
        '18': 'number_18_plus',
        'all': 'number_all_ages',
    },
    'rate': {
        '0': 'rate_0_17',
        '18': 'rate_18_plus',
        'all': 'rate_all_ages',
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
        var self = this;

        // Init form
        self.form = self.initForm();

        // Get settings from form
        self.settings = self.getFormSettings();

        // Static settings
        self.histogram_root = '#histogram_svg';
        self.target_for_2020 = self.set2020Target();
        
        // Get data based on settings
        self.jsonData = self.getData();

        // Draw graph
        self.renderGraph();
    },
    renderGraph: function(){
        var self = this;

        self.data_property = self.setDataProperty();


        /* SVG Preparation
        ----------------------------------------------------------------------*/

        var $histogram_svg = jQuery(self.histogram_root),
            histogram_svg_width = $histogram_svg.outerWidth();

        var values = self.makeHistorgramDataArray();

        var margin = {top: 100, right: 10, bottom: 30, left: 10},
            width = histogram_svg_width - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;

        var data_max = self.xRangeMax();

        // A formatter for counts.
        var formatCount = d3.format(",.0f");

        var x = d3.scale.linear()
            .domain([0, data_max])
            .range([0, width]);

        // Generate a histogram bins
        var bins = self.makeHistogramBins(values);
        var bin_width = Math.floor(width / 20);

        var tickValues = [];
        for( var j = 0; j < bins.length; j++){
            tickValues.push(bins[j].x);
        }

        var xAxis = d3.svg.axis()
            .scale(x)
            .tickValues(tickValues)
            .tickFormat(function(d){
                if( d > 1000 ){
                    return Math.floor(d/100)/10 + 'k';
                } else {
                    return d;
                }
            })
            .orient('bottom');

        var y = d3.scale.linear()
            .domain([0, d3.max(bins, function(d) { return d.count; })])
            .range([height, 0]);


        /* SVG Graphic
        ----------------------------------------------------------------------*/

        var svg = d3.select(self.histogram_root).append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
          .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        self.svg = svg;

        var bar = svg.selectAll('.bar')
            .data(bins, function(d, idx){ return idx; })
          .enter().append('g')
            .attr('class', 'bar')
            .attr('transform', function(d, idx) {
                return 'translate(' + bin_width * idx + ',0)';
            });

        bar.append('rect')
            .attr('x', 1)
            .attr('y', function(d){
                return y(d.count);
            })
            .attr('width', bin_width - 1)
            .attr('height', function(d) { return height - y(d.count); });

        bar.append('text')
            .attr('dy', '.75em')
            .attr('y', function(d){
                return y(d.count) -15;
            })
            .attr('x', bin_width / 2)
            .attr('text-anchor', 'middle')
            .text(function(d){
                if( d.count > 0 ){
                    return formatCount(d.count);
                } else {
                    return '';
                }
            });

        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis);
    },
    updateHistogram: function(){
        var self = this;

        // Update graph value
        self.data_property = self.setDataProperty();


        /* SVG Preparation
        ----------------------------------------------------------------------*/

        var $histogram_svg = jQuery(self.histogram_root),
            histogram_svg_width = $histogram_svg.outerWidth();

        var values = self.makeHistorgramDataArray();

        var margin = {top: 100, right: 10, bottom: 30, left: 10},
            width = histogram_svg_width - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;

        var data_max = self.xRangeMax();

        // A formatter for counts.
        var formatCount = d3.format(",.0f");

        var x = d3.scale.linear()
            .domain([0, data_max])
            .range([0, width]);

        // Generate a histogram bins
        var bins = self.makeHistogramBins(values);
        var bin_width = Math.floor(width / 20);

        var tickValues = [];
        for( var j = 0; j < bins.length; j++){
            tickValues.push(bins[j].x);
        }

        var xAxis = d3.svg.axis()
            .scale(x)
            .tickValues(tickValues)
            .tickFormat(function(d){
                if( d > 1000 ){
                    return Math.floor(d/100)/10 + 'k';
                } else {
                    return d;
                }
            })
            .orient('bottom');

        var y = d3.scale.linear()
            .domain([0, d3.max(bins, function(d) { return d.count; })])
            .range([height, 0]);


        /* SVG Update
        ----------------------------------------------------------------------*/

        svg = self.svg;

        var bar = svg.selectAll('.bar')
                     .data(bins, function(d, idx){ return idx; });

        // Enter join
        bar.enter().append('g')
            .attr('class', 'bar')
            .attr('transform', function(d, idx) {
                return 'translate(' + (bin_width * idx) + ',0)';
            });

        // Update join
        svg.selectAll('.bar rect')
            .data(bins)
            .transition()
                .attr('x', 1)
                .attr('y', function(d){
                    return y(d.count);
                })
                .attr('width', bin_width - 1)
                .attr('height', function(d) { return height - y(d.count); });

        svg.selectAll('.bar text')
            .data(bins)
            .transition()
            .attr('y', function(d){
                return y(d.count) - 15;
            })
            .attr('x', Math.ceil(width / 20) / 2)
            .text(function(d){
                if( d.count > 0 ){
                    return formatCount(d.count);
                } else {
                    return '';
                }
            });

        // Remove empty data
        bar.exit().remove();

        // Update .x.axis
        svg.select('.x.axis')
            .transition()
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis);
    },
    makeHistorgramDataArray: function(){
        var self = this;
        // Make a list of values based on form settings for values and ages
        var values = [];
        for( var k in self.jsonData ){
            if( self.jsonData.hasOwnProperty(k) && k != 'CALIFORNIA'){
                var num = self.jsonData[k][self.data_property];
                var new_obj = [k, parseInt(num)];
                values.push(new_obj);
            }
        }

        return values
    },
    initForm: function(){
        var self = this;
        $form = jQuery('#histogram_form');

        $form.find('select').on('change', function(event){
            var $this = jQuery(this);

            // Update self.settings
            switch( $this.attr('name') ) {
                case 'map':
                    self.settings.map = $this.val();
                    break;
                case 'values':
                    self.settings.values = $this.val();
                    break;
                case 'ages':
                    self.settings.ages = $this.val();
                    break;
            }

            // Update the source data set
            self.jsonData = self.getData();

            self.updateHistogram();
        });

        return $form;
    },
    getFormSettings: function(){
        var self = this;

        var settings = {
            map: self.form.find('select[name="map"]').val(),
            values: self.form.find('select[name="values"]').val(),
            ages: self.form.find('select[name="ages"]').val(),
        }
        return settings;
    },
    getData: function(){
        var self = this;

        if( self.settings.map == 'county' ){
            return jsonDataCounty;
        } else {
            return jsonDataZip;
        }
    },
    xRangeMax: function(){
        var self = this;

        switch( self.settings.map ){
            case 'county':
                var data = minMaxCounty;
                break;
            case 'zip':
                var data = minMaxZip;
                break;
        }

        var max = false;
        if( self.settings.values == 'number' ){
            max = data[self.settings.values][self.settings.ages]['max'];
        } else {
            max = data[self.settings.values]['max'];
        }

        // Round up to nearest multiple of 20
        if( max % 20 == 0 ){ max += 1;}
        return Math.ceil( max / 20 ) * 20;
    },
    makeHistogramBins: function(values){
        var self = this;

        var max = self.xRangeMax();
        var interval = max / 20;

        var bins = []
        for( var i = 0; i < 20; i++){
            bins.push({count: 0, x: interval*i});
        }

        for( var j = 0; j < values.length; j++ ){
            var val = values[j][1];
            var idx = Math.floor(val / interval) || 0;
            bins[idx]['count'] += 1;
        }
        return bins;
    },
    setDataProperty: function(){
        var self = this;
        return column_names[self.settings.values][self.settings.ages];
    },
    set2020Target: function(){
        var self = this;

        if( self.settings.map == 'county' ){
            return 35;
        } else {
            return 300;
        }        
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