/*------------------------------------------------------------------------------
    :: Main Init / Controller
------------------------------------------------------------------------------*/

var CHCF = {
    dataMapInit: function(){

        var $window = jQuery(window);

        // Subnav                
        AffixNav.init($window.width());

        // MapBox map init
        MBox.init(jsonDataCounty, jsonDataZip, minMaxCounty, minMaxZip); // jsonData via index.php

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

        // make histogram data sets
        self.histogramData = self.makeHistorgramData();

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

        var values = self.makeHistorgramData();

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
            .attr('height', function(d) { return height - y(d.count); })
            .attr('fill', function(d){
                return self.getRectColor(x(d.x), x(28), bin_width);
            });

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

        var target_line_offset = 40; // pushes line over within target g
        var target = svg.append('g')
                        .attr('class', 'target')
                        .attr('transform', 'translate('+ (x(28)-target_line_offset) +'0,-40)');

        target.append('text')
                .text('2022 Target');

        target.append('rect')
                .attr('x', target_line_offset)
                .attr('y', 7)
                .attr('width', 1)
                .attr('height', 210)
                .attr('fill', '#666666');

        if( self.settings.values == 'rate' ){
            target.attr('class', 'target show');
        }

        /* Sidebar Data elements
        ----------------------------------------------------------------------*/

        var targetData = self.getTargetStats();
        // console.log(targetData);
        $stats = jQuery('.histogram_stats');

        $stats.find('.on_target')
              .find('.number_on').html(targetData.on.count).end()
              .find('.average_rate').html(
                    format_number(targetData.on.avg_rate)).end()
              .find('.average_total').html(
                    format_number(targetData.on.avg_number));

        $stats.find('.off_target')
              .find('.number_on').html(targetData.off.count).end()
              .find('.average_rate').html(
                    format_number(targetData.off.avg_rate)).end()
              .find('.average_total').html(
                    format_number(targetData.off.avg_number));

    },
    updateHistogram: function(){
        var self = this;

        // Update graph value
        self.data_property = self.setDataProperty();

        self.target_for_2020 = self.set2020Target();

        /* SVG Preparation
        ----------------------------------------------------------------------*/

        var $histogram_svg = jQuery(self.histogram_root),
            histogram_svg_width = $histogram_svg.outerWidth();

        var values = self.makeHistorgramData();

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
                .attr('height', function(d) { return height - y(d.count); })
                .attr('fill', function(d){
                    console.log(d);
                    return self.getRectColor(x(d.x), x(28), bin_width);
                });

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

        var target = svg.select('.target');
        if( self.settings.values == 'rate' && self.settings.ages == '0' ){
            target.attr('class', 'target show');
        } else {
            target.attr('class', 'target');
        }

        /* Sidebar Data elements
        ----------------------------------------------------------------------*/

        var targetData = self.getTargetStats();
        // console.log(targetData);
        $stats = jQuery('.histogram_stats');

        if( self.settings.values == 'rate' ){
            $stats.find('.on_target')
                  .find('.number_on').html(targetData.on.count).end()
                  .find('.average_rate').html(
                        format_number(targetData.on.avg_rate)).end()
                  .find('.average_total').html(
                        format_number(targetData.on.avg_number));

            $stats.find('.off_target')
                  .find('.number_on').html(targetData.off.count).end()
                  .find('.average_rate').html(
                        format_number(targetData.off.avg_rate)).end()
                  .find('.average_total').html(
                        format_number(targetData.off.avg_number));

            $stats.removeClass('number').addClass('rate');
        } else {
            $stats.find('.average_total').html(
                        format_number(targetData.on.avg_number));
            $stats.removeClass('rate').addClass('number');
        }
    },
    makeHistorgramData: function(){
        var self = this;

        var map = self.settings.map;
        var values = self.settings.values;
        var ages = self.settings.ages;

        var data = [];

        // Loop through geo data
        for( var k in self.jsonData ){
            if( self.jsonData.hasOwnProperty(k) && k != 'CALIFORNIA'){
                var obj = self.jsonData[k];
                data.push([k, obj[self.data_property]]);
            }
        }

        return data;
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
    getRectColor: function(d, target_x, bin_width){
        var self = this;

        if( self.settings.values == 'rate' && self.settings.ages == '0' ){

            if( target_x < d ){ // all of bin is over target
                return red_colors[4];
            }
            if( d <= target_x && target_x < (d + bin_width) ){
                console.log(d + ' ' + target_x + ' ' + bin_width);
                return red_colors[2];
            }
            if( d + bin_width < target_x ){
                return green_colors[0];
            }
        } else {
            return '#4682B4';
        }
    },
    getData: function(){
        var self = this;

        if( self.settings.map == 'county' ){
            return jsonDataCounty;
        } else {
            return jsonDataZip;
        }
    },
    getTargetStats: function(){
        var self = this;

        var on_target = [];
        var off_target = [];

        var ages = self.settings.ages;
        var values = self.settings.values;

        // Sort geo data for target 2020
        var on_target = [];
        var off_target = [];
        var sort_on = self.data_property;

        for( var k in self.jsonData ){
            if( self.jsonData.hasOwnProperty(k) && k != 'CALIFORNIA'){
                var obj = self.jsonData[k];
                if( obj[sort_on] <= self.target_for_2020 ){
                    on_target.push(obj);
                } else {
                    off_target.push(obj);
                }
            }
        }

        var rate_key = 'rate_0_17';
        var number_key = 'number_0_17';

        var data = {
            'on': {
                'count': on_target.length,
                'avg_rate': get_average(on_target, rate_key),
                'avg_number': get_average(on_target, number_key),
            },
            'off': {
                'count': off_target.length,
                'avg_rate': get_average(off_target, rate_key),
                'avg_number': get_average(off_target, number_key),
            }
        }

        function get_average(values, data_property){
            var sum = 0;
            for( var i = 0; i < values.length; i++ ){
                var val = values[i][data_property];
                if( val ){
                    sum = sum + parseInt(val,10);
                }
            }
            if( values.length > 0 ){
                return Math.floor(sum / values.length * 10) / 10;
            } else {
                return 0;
            }
        }

        return data;
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

        var last_bin_lower = bins[19]['x']; // bottom bound of last bin

        for( var j = 0; j < values.length; j++ ){
            var val = values[j][1] || 0;

            var idx = Math.floor(val / interval);

            // Handle zips having a higher range *** DELETE once figure out scale ***
            if( idx >= 20 ){
                idx = 19;
            }
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

        var targets = {
            'county': {
                'number': 1000,
                'rate': 28,
            },
            'zip': {
                'number': 300,
                'rate': 28,
            }
        }

        return targets[self.settings.map][self.settings.values];
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
