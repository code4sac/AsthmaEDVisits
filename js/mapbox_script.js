
/* Vector shape styles
------------------------------------------------------------------------------*/

var defaultStyle = {
    weight: 1,
    opacity: 1,
    color: 'white',
    fillOpacity: 0.8,
    fillColor: colors[0] // color overrided in getStyle()
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
    init: function(jsonDataCounty, jsonDataZip, maxRate, hashValues){
        var self = this;

        // Set base tile map
        self.base_tile_type = 'mapbox.light';

        // Get settings from window hash if exist
        self.hashValues = hashValues;

        // self.hashValues = self.getHash();
        self.ages = self.hashValues.age;
        self.map = self.hashValues.map;

        var $mapForm = jQuery('#mapForm');
        $mapForm.find('select[name="ages"]').val(self.ages)
                .end()
                .find('select[name="map"]').val(self.map);
        
        // Set data to use throughout
        self.jsonDataCounty = jsonDataCounty;
        self.jsonDataZip = jsonDataZip;

        // Get column name and max value
        self.data_property = column_names[self.ages];
        self.data_max = maxRate;
        self.interval_width = self.setIntervalWidth();

        // Fire it up!
        var maps = self.onReady();

        return maps;
    },
    onReady: function(){
        var self = this;

        L.mapbox.accessToken = 'pk.eyJ1IjoibXJzaG9yZXMiLCJhIjoiZDQwYjc2ZjJlOTM1YTlhMjI4N2JlNDg2ODI0NTlkMTcifQ.rlAJW20fwjEB8H9ptH1bNA';


        /* Create Maps
        ----------------------------------------------------------------------*/

        var map = L.mapbox.map('map', self.base_tile_type, {
                                doubleClickZoom: false, // Disable default double-click behavior
                                scrollWheelZoom: false,
                            })
                            .setView([37.4, -118], 6)
                            .on('dblclick', function(e) {
                                // Zoom exactly to each double-clicked point
                                map.setView(e.latlng, map.getZoom() + 1);
                            });

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
            self.updateHashAndSocial();
            updateMapAndLegend();
        });

        // Update if the map filter changes
        $mapForm.find('select[name="map"]').on('change', function(event){
            self.map = jQuery(this).val();
            self.updateHashAndSocial();
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
            // Update data_property
            self.data_property = column_names[self.ages];
            // self.intervals = self.buildColorIntervals();

            jsonData = self.getData();

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

            // Correct for null values
            if( d == "" || d == null ){ return grayColor; }

            // Divide by interval_width for id of color bin
            d = Math.floor( d / self.interval_width );

            if( d < 8 ){
                return colors[d];
            } else {
                // All numbers beyond the last bin go in the last bin
                return colors[colors.length - 1]; // last color
            }
        }

        /* Map legend
        ------------------------------------------------------------*/

        function getLegendHTML(){
            // use self.intervals with colors to build map legend

            // Set top text
            var text = '<span>Rate per 10,000</span><ul>';

            var labels = [];

            var width = self.interval_width,
                from = 0,
                to = width;

            for( var i = 0; i < 8; i++ ){

                if( i < 8 - 1 ){
                    labels.push(
                        '<li><span class="swatch" style="background:' + colors[i] + '"></span> ' +
                        from + '&ndash;' + to + '</li>'
                    );
                } else {
                    labels.push(
                        '<li><span class="swatch" style="background:' + colors[i] + '"></span> ' +
                        from + '+</li>'
                    );
                }


                from += width;
                to += width;
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

            if( self.map == 'county' ){
                var geo_type = 'County';
                var title = layer.feature.properties.title;
            } else {
                var geo_type = 'Zip Code';
                var title = name;
            }

            var text = '<div class="marker-title">' + title + ' ' + geo_type + '</div>';

            if( value == "" || value == null ){
                text += '<em>Rate not calculable</em>';
            } else {
                text += '<strong>' + value + '</strong> rate per 10,000';
            }

            popup.setLatLng(e.latlng);
            popup.setContent(text);

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
    },
    getHash: function(){
        var self = this;

        var raw = window.location.hash;
        if( raw.length ){
            raw = raw.replace('#', '');
            raw = raw.split('&');
            for( var i = 0; i < raw.length; i++ ){
                var split = raw[i].split('='); // values=number --> ['values', 'number']
                self.hashValues[split[0]] = split[1]; // hasValues['values'] = 'number'
            }
        }
        // No return statement, sets hashValues in `for` loop above
    },
    updateHashAndSocial: function(){
        var self = this;

        // var new_hash = '#ages=' + self.ages + '&map=' + self.map;
        // // Update has without scrolling the window
        // var scrollmem = jQuery(window).scrollTop();
        // window.location.hash = new_hash;
        // jQuery(window).scrollTop(scrollmem);
        // Update map social URLs

        var new_social = '?map=' + self.map + self.ages;

        window.history.replaceState('state_map', 'Asthma ED Visits', new_social);

        // Update map social links
        jQuery('.map_wrap .social a').each(function(){
            $this = jQuery(this);
            var href = $this.attr('href');

            if( $this.hasClass('st-icon-twitter') ){
                console.log(href);
                var spliter = 'url='; // twitter intent url parameter
            } else {
                var spliter = 'u='; // facebook url parameter
            }

            href = href.split(spliter);
            href = href[0] + spliter + href[1].split('?')[0];
            href = href + new_social;

            $this.attr('href', href);
        });
    },
    getData: function(){
        var self = this;
        if( self.map == 'county' ){
            return self.jsonDataCounty;
        } else {
            return self.jsonDataZip;
        } 
    },
    setIntervalWidth: function(){
        var self = this;

        var width = Math.ceil(self.data_max / 8);

        return width;
    },
} // end var MBox
