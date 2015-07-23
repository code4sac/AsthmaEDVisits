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

// Map colors light to dark
var colors = ['#FFEDA0', '#FED976', '#FEB24C', '#FD8D3C', '#FC4E2A', '#E31A1C', '#BD0026', '#800026']


/* Vector shape styles
------------------------------------------------------------------------------*/

var defaultStyle = {
    weight: 1,
    opacity: 1,
    color: 'white',
    fillOpacity: 0.7,
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

        if( self.map == 'county' ){
            var geographyLayer = L.mapbox.featureLayer(countyGeoJSON)
                                         .addTo(map);
            drawShapesByDataValue();
            drawLegendByDataValue();
            initFeatureInteractivity();
        } else {
            var geographyLayer = omnivore.topojson('/chcf-r1-1/js/ca-zip.json')
                                         .addTo(map)
                                         .on('ready', function() {
                                            drawShapesByDataValue();
                                            drawLegendByDataValue(); 
                                            initFeatureInteractivity();
                                         });            
        }


        /* Set styles for each GeoJSON feature
        ----------------------------------------------------------------------*/

        // Update if the age filter changes
        jQuery('#mapForm select[name="ages"]').on('change', function(event){
            self.ages = jQuery(this).val();
            self.updateHash();
            updateMapAndLegend();
        });

        // Update if the age filter changes
        jQuery('#mapForm select[name="values"').on('change', function(event){
            self.values = jQuery(this).val();
            self.updateHash();
            updateMapAndLegend();
        });

        // Update if the age filter changes
        jQuery('#mapForm select[name="map"').on('change', function(event){
            self.map = jQuery(this).val();
            self.updateHash();
            updateMapAndLegend();
        });

        function updateMapAndLegend(){
            // Update data_property and max
            self.data_property = column_names[self.values][self.ages];
            self.data_max = self.getMax();
            // Update the map and the legend
            drawShapesByDataValue();
            drawLegendByDataValue(); 
        }

        function drawShapesByDataValue(){
            geographyLayer.eachLayer(function(e){
                style = getStyle(e.feature);
                e.setStyle(style);
            });
        }

        function drawLegendByDataValue(){
            map.legendControl.removeLegend(self.legend_html);

            self.legend_html = getLegendHTML();
            map.legendControl.addLegend(self.legend_html);
            // console.log(map.legendControl);
        }

        function initFeatureInteractivity(){
            geographyLayer.eachLayer(function(e){
                onEachFeature(e.feature, e); // e = layer
            });
        }


        /* Set styles for each GeoJSON feature
        ----------------------------------------------------------------------*/
        function getStyle(feature) {
            var name = feature.properties.name;
        
            try {
                var value = jsonData[name][self.data_property];
            } catch(err) {
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

            var q = self.data_max / 8,
                v1 = 0,
                v2 = 0;

            for( var i = 1; i <= 8; i++ ){
                v1 = Math.ceil(q*(i-1))
                v2 = Math.ceil(q*(i))

                if( v1 <= d && d < v2 ){
                    return colors[i-1];
                }
            }
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
                
                var title = layer.feature.properties.title;
                    slug = title.toLowerCase().replace(/\s+/g, '-');

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
            var title = layer.feature.properties.title;
            var name = layer.feature.properties.name;

            try {
                var value = jsonData[name][self.data_property];
            } catch(err) {
                var value = null;
            }

            if( value == null ){
                value = '<5';
            }

            if( self.values == 'rate' ){
                unit_text = 'rate per 10,000';
            } else {
                unit_text = 'total ED visits';
            }

            if( self.map == 'county' ){
                var geo_type = 'County';
            } else {
                var geo_type = 'Zip Code';
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
                var style = getStyle(layer.feature);
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


        /* Map legend
        ------------------------------------------------------------*/

        function getLegendHTML(){

            var q = self.data_max / 8,
                grades = [];
                labels = [],
                from = '',
                to = '';

            for( var i = 1; i <= 8; i++){
                grades[i-1] = Math.ceil(q * (i - 1));
            }

            for (var i = 0; i < grades.length; i++) {
                from = grades[i];
                to = grades[i + 1];

                labels.push(
                    '<li><span class="swatch" style="background:' + getColor(from + 1) + '"></span> ' +
                    from + (to ? '&ndash;' + to : '+')) + '</li>';
            }

            if( self.values == 'number' ){
                var text = '<span>Number of ED Visits</span><ul>';
            } else {
                var text = '<span>Rate per 10,000</span><ul>';
            }

            return text + labels.join('') + '</ul>';
        }


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
    }
} // end var MBox
