
/* Vector shape styles
------------------------------------------------------------------------------*/

var defaultStyle = {
    weight: 1,
    opacity: 1,
    color: 'white',
    fillOpacity: 0.8,
    fillColor: red_colors[0] // color overrided in getStyle()
}

var hoverStyle = {
    weight: 1,
    opacity: 1,
    color: 'white',
    fillOpacity: 0.9
}

var selectedStyle = {
    weight: 1,
    opacity: 1,
    color: 'black',
    fillOpacity: 0.9
}

var emptyStyle = {
    weight: 0,
    opacity: 1,
    color: 'white',
    fillOpacity: 0
}

/* Vector shape styles
------------------------------------------------------------------------------*/

var MBox = {
    init: function(jsonDataCounty, jsonDataZip, minMaxCounty, minMaxZip){
        var self = this;

        // Set base tile map
        self.base_tile_type = 'mapbox.light';

        // Get settings from window hash if exist
        var hash = self.getHash();
        self.values = hash.values;
        self.ages = hash.ages;
        self.map = hash.map;

        var $mapForm = jQuery('#mapForm');
        $mapForm.find('select[name="values"]').val(self.values)
                .end()
                .find('select[name="ages"]').val(self.ages)
                .end()
                .find('select[name="map"]').val(self.map);
        
        // Set data to use throughout
        self.jsonDataCounty = jsonDataCounty;
        self.jsonDataZip = jsonDataZip;

        // Set data to use throughout
        self.minMaxCounty = minMaxCounty;
        self.minMaxZip = minMaxZip;

        // Get column name and max value
        self.data_property = column_names[self.values][self.ages];
        self.data_max = self.getMax();

        // Build color intervals
        self.intervals = self.buildColorIntervals();

        // Fire it up!
        self.onReady();
    },
    onReady: function(){
        var self = this;

        L.mapbox.accessToken = 'pk.eyJ1IjoibXJzaG9yZXMiLCJhIjoiZDQwYjc2ZjJlOTM1YTlhMjI4N2JlNDg2ODI0NTlkMTcifQ.rlAJW20fwjEB8H9ptH1bNA';

        var map = L.mapbox.map('map', self.base_tile_type, {
                                doubleClickZoom: false, // Disable default double-click behavior
                                scrollWheelZoom: false,
                            })
                            .setView([37.4, -118], 6)
                            .on('dblclick', function(e) {
                                // Zoom exactly to each double-clicked point
                                map.setView(e.latlng, map.getZoom() + 1);
                            });

        // MapBox interaction settings
        // map.scrollWheelZoom.disable();

        jsonData = self.getData();


        /* Add GeoJSON and TopoJSON to map
        ----------------------------------------------------------------------*/
        var countyLayer = L.mapbox.featureLayer(countyGeoJSON);
        drawShapesByDataValue(countyLayer, 'county');
        initFeatureInteractivity(countyLayer);

        // Build Zip layer
        // https://github.com/mapbox/leaflet-omnivore
        // https://www.mapbox.com/mapbox.js/example/v1.0.0/omnivore-gpx/
        var zipLayer = omnivore.topojson(rootUrl + 'js/CA_2010_ZCTA5CE.json')
                                     .on('ready', function() {
                                        drawShapesByDataValue(this, 'zip');
                                        initFeatureInteractivity(this);
                                     });

        // Add layer to map by self.map
        if( self.map == 'county' ){
            countyLayer.addTo(map);
        } else {
            zipLayer.addTo(map);
        }

        drawLegendByDataValue();


        /* Draw shapes, legend, and add interactivity
        ----------------------------------------------------------------------*/

        function drawShapesByDataValue(featureLayer, map_type){
            featureLayer.eachLayer(function(e){
                style = getStyle(e.feature, map_type);
                e.setStyle(style);
            });
        }

        function drawLegendByDataValue(){
            map.legendControl.removeLegend(self.legend_html);

            self.legend_html = getLegendHTML();
            map.legendControl.addLegend(self.legend_html);
        }

        function initFeatureInteractivity(featureLayer){
            featureLayer.eachLayer(function(e){
                onEachFeature(e.feature, e); // e = layer
            });
        }


        /* Map controls
        ----------------------------------------------------------------------*/

        $mapForm = jQuery('#mapForm');

        // Update if the age filter changes
        $mapForm.find('select[name="ages"]').on('change', function(event){
            self.ages = jQuery(this).val();
            self.updateHash();
            updateMapAndLegend();
        });

        // Update if the age filter changes
        $mapForm.find('select[name="values"]').on('change', function(event){
            self.values = jQuery(this).val();
            self.updateHash();
            updateMapAndLegend();
        });

        // Update if the age filter changes
        $mapForm.find('select[name="map"]').on('change', function(event){
            self.map = jQuery(this).val();
            self.updateHash();
            updateMapAndLegend();
            toggleLayers(self.map);
        });

        jQuery('#map_form a.download').on('click', function(event){

            $selected_geo = jQuery('.selected_wrap #selected a');

            if( $selected_geo.length != 0 ){
                var selected_keys = []; 
                $selected_geo.each(function(){
                    selected_keys.push(jQuery(this).attr('data-name'));
                });
                var downloadData = {};
                for( var i = 0; i < selected_keys.length; i++ ){
                    var k = selected_keys[i];
                    downloadData[k] = jsonData[k];
                }
            } else {
                var downloadData = jsonData;
            }

            var csvData = make_csv_data(downloadData); // utils.js

            filename = 'AsthmaEDRates_' + self.map + '.csv';

            $(this)
                .attr({
                'download': filename,
                'href': csvData,
                'target': '_blank'
            });
        });

        function updateMapAndLegend(){
            // Update data_property and max
            self.data_property = column_names[self.values][self.ages];
            self.data_max = self.getMax();
            self.intervals = self.buildColorIntervals();

            if( self.map == 'county' ){
                drawShapesByDataValue(countyLayer, 'county');
            } else {
                drawShapesByDataValue(zipLayer, 'zip');
            }
            drawLegendByDataValue(); 
        }

        function toggleLayers(map_name){
            // Remove any selected items
            jQuery('#selected a').remove();
            // map_name is the new requested map, not the current displayed
            if( map_name == 'county' ){
                map.removeLayer(zipLayer);
                countyLayer.addTo(map);
            } else {
                map.removeLayer(countyLayer);
                zipLayer.addTo(map);
            }
        }


        /* Set styles for each GeoJSON feature
        ----------------------------------------------------------------------*/

        function getStyle(feature, map_type) {
            var name = feature.properties.name;
        
            if( map_type == 'county' ){
                var use_data = self.jsonDataCounty;
            } else {
                var use_data = self.jsonDataZip;
            }

            try {
                // See if feature name is in data
                var value = use_data[name][self.data_property];
            } catch(err) {
                // Return empty style if feature name is not in data
                feature.properties.emptyStyle = true;
                return emptyStyle;                
            }           

            var style = defaultStyle;
            style.fillColor = getColor(value);
            style.className = feature.properties.name;

            return style;
        }

        // get color depending on asthma value
        function getColor(d) {

            var intervals = self.intervals;
            var range = [0, intervals.length];
            var mid;

            d = d == null ? 0 : d; // remove null values

            for( var i = 0; i < intervals.length; i++ ){
                if( intervals[i].start <= d && d <= intervals[i].end + 1){
                    return intervals[i].color;
                } else {
                    // color large values
                    if( intervals[intervals.length - 1].start <= d ){
                        return intervals[intervals.length - 1].color;
                    }
                }
            }
        }


        /* Map legend
        ------------------------------------------------------------*/

        function getLegendHTML(){
            // use self.intervals with colors to build map legend

            // Set top text
            if( self.values == 'number' ){
                var text = '<span>Number of ED Visits</span><ul>';
            } else {
                var text = '<span>Rate per 10,000</span><ul>';
            }

            var labels = [];

            var color,
                from,
                to;

            for( var i = 0; i < self.intervals.length; i++ ){
                from = self.intervals[i].start;
                to = self.intervals[i].end;
                color = self.intervals[i].color;

                if( i < self.intervals.length - 1 ){
                    to = '&ndash;' + to;
                } else {
                    to = '+';
                }

                labels.push(
                    '<li><span class="swatch" style="background:' + color + '"></span> ' +
                    from + to + '</li>'
                );
            }

            return text + labels.join('') + '</ul>';
        }

        /* Set actions on each GeoJSON feature
        ----------------------------------------------------------------------*/

        function onEachFeature(feature, layer) {
            layer.on({
                mousemove: mousemove,
                mouseout: mouseout,
                click: clickHandler,
                dblclick: dblclickHandler,
            });
            layer.is_selected = false;
        }

        var popup = new L.Popup({ autoPan: false });

        var closeTooltip;

        function clickHandler(e){
            var layer = e.target;

            // Ignore click on empty zip
            if( !layer.feature.properties.emptyStyle ){
                
                if( self.map == 'county' ){
                    var title = layer.feature.properties.title;
                } else {
                    var title = layer.feature.properties.name;
                }

                slug = title.toLowerCase().replace(/\s+/g, '_');

                // Swap value of is_selected
                layer.is_selected = !layer.is_selected;

                // highlight feature
                if( layer.is_selected ){
                    layer.setStyle(selectedStyle);
                } else {
                    layer.setStyle(hoverStyle);
                }

                if (!L.Browser.ie && !L.Browser.opera) {
                    layer.bringToFront();
                }

                $selected = jQuery('#selected');
                if( layer.is_selected ){
                    // Add selected geography to sidebar
                    var html = '<a href="#" data-name="'+ slug +'"><span class="label label-default">'+ title + '</span></a>';

                    $selected.parent().addClass('has_selected');
                    $selected.append(html);
                } else {
                    $selected.find('a[data-name="'+ slug +'"]').remove();

                    // Remove has_selected if no more <a>
                    if( $selected.find('a').length == 0 ){
                        $selected.parent().removeClass('has_selected');
                    }

                }
            }
        }

        function mousemove(e) {
            var layer = e.target;
            var name = layer.feature.properties.name;

            try {
                var value = jsonData[name][self.data_property];
            } catch(err) {
                var value = null;
            }

            if( value == null ){
                value = '0';
            }

            if( self.values == 'rate' ){
                unit_text = 'rate per 10,000';
            } else {
                unit_text = 'total ED visits';
            }

            if( self.map == 'county' ){
                var geo_type = 'County';
                var title = layer.feature.properties.title;
            } else {
                var geo_type = 'Zip Code';
                var title = name;
            }

            popup.setLatLng(e.latlng);
            popup.setContent('<div class="marker-title">' + title + ' ' + geo_type + '</div>' +
                '<strong>' + value + '</strong> ' + unit_text);

            // If not an emplty zip, show popup and hover style
            if( !layer.feature.properties.emptyStyle ){
                if( !popup._map ){ popup.openOn(map);}
                window.clearTimeout(closeTooltip);

                // highlight feature
                if( !layer.is_selected ){
                    layer.setStyle(hoverStyle);
                }

                if (!L.Browser.ie && !L.Browser.opera) {
                    layer.bringToFront();
                }
            }
        }

        function mouseout(e) {
            var layer = e.target;

            closeTooltip = window.setTimeout(function() {
                map.closePopup();
            }, 100);

            if( !layer.is_selected ){
                var style = getStyle(layer.feature, self.map);
                layer.setStyle(style);
            }
        }

        function dblclickHandler(e){
            var layer = e.target;
            if( !layer.feature.properties.emptyStyle ){
                // Zoom exactly to each double-clicked point
                map.setView(e.latlng, map.getZoom() + 1);
            }
        }

        /* Fitler features
        ------------------------------------------------------------*/

        function filterFeatures(){
            console.log('filterFeatures');
        }


        /* Search Filter
        ------------------------------------------------------------*/

        // Initialize the geocoder control and add it to the map.
        var geocoderControl = L.mapbox.geocoderControl('mapbox.places', {
            autocomplete: true
        });
        geocoderControl.addTo(map);

        // Listen for the `found` result and display the first result
        // in the output container. For all available events, see
        // https://www.mapbox.com/mapbox.js/api/v2.2.1/l-mapbox-geocodercontrol/#section-geocodercontrol-on
        geocoderControl.on('found', function(res){
            // output.innerHTML = JSON.stringify(res.results.features[0]);
        }).on('select', function(res){
            console.log(res);
        });


        /* Add Attribution
        ------------------------------------------------------------*/

        map.attributionControl.addAttribution('Data from ' +
            '<a href="#">CHCF</a>');
    },
    getHash: function(){
        var raw = window.location.hash;
        var hashValues = {
            values: 'rate',
            ages: '0',
            map: 'county'
        }

        raw = raw.replace('#', '');
        raw = raw.split('&');

        for( var i = 0; i < raw.length; i++ ){
            var split = raw[i].split('='); // values=number --> ['values', 'number']
            hashValues[split[0]] = split[1]; // hasValues['values'] = 'number'
        }
        return hashValues;
    },
    updateHash: function(){
        var self = this;
        var new_hash = '#values=' + self.values + '&ages=' + self.ages + '&map=' + self.map;
        // Update has without scrolling the window
        var scrollmem = jQuery(window).scrollTop();
        window.location.hash = new_hash;
        jQuery(window).scrollTop(scrollmem);
    },
    getData: function(){
        var self = this;
        if( self.map == 'county' ){
            return self.jsonDataCounty;
        } else {
            return self.jsonDataZip;
        } 
    },
    getMax: function(){
        var self = this;
        // Set min/max data by map type
        if( self.map == 'county' ){
            var max_data = self.minMaxCounty;
        } else {
            var max_data = self.minMaxZip;
        }
        // Get min/max for values type
        if( self.values == 'number' ){
            // `number` has max/min for each group [all] and [0-17, 18+]
            return max_data[self.values][self.ages]['max'];
        } else {
            // `rate` has max/min for 1 group [all, 0-17, 18+]
            return max_data[self.values]['max'];
        }
    },
    buildColorIntervals: function(){
        var self = this;

        var min = 0,
            max = self.data_max,
            split_at = 28,
            values = self.values,
            ages = self.ages;

        var intervals = [];

        if( values == 'rate' && ages == 0 ){
            // Build intervals for 2022 target
            intervals = self.makeIntervals(min, split_at, 2);
            intervals_2 = self.makeIntervals(split_at + 1, max, 8);
            intervals.push.apply(intervals, intervals_2);
            // Add colors from utils.js for 2022 (includes greens)
            intervals = self.addColorsToIntervals(intervals, colors2022);
        } else {
            // Build intervals for everyone else
            intervals = self.makeIntervals(0, max, 8);
            // Add colors from utils.js for regular reds
            intervals = self.addColorsToIntervals(intervals, colors);
        }

        return intervals;
    },
    makeIntervals: function(min, max, number){

        // Get range of each interval between `min` and `max`
        var width = (max - min) / number;
        var intervals = [];

        // Build intervals, a list of {start: ?, end: ?} objects
        for( var i = 0; i < number; i++){
            var start_val = Math.ceil(min + (width * i));
            intervals[i] = {'start': start_val};

            // Add ending values to previous item
            if( 0 < i && i < number ){
                intervals[i-1]['end'] = start_val - 1;
            }
            // Make last ending the `max`
            if( i == number - 1 ){
                intervals[i]['end'] = max;
            }
        }
        return intervals;
    },
    addColorsToIntervals: function(intervals, colors){
        for( var i = 0; i < intervals.length; i++){
            intervals[i]['color'] = colors[i];
        }
        return intervals;
    }
} // end var MBox
