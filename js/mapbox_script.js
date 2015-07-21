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


/* Vector shape styles
------------------------------------------------------------------------------*/

var MBox = {
    init: function(jsonData, minMax, ages, values){
        var self = this;
        // Set data to use throughout
        self.jsonData = jsonData;
        self.ages = ages;
        self.values = values;

        // Get column name
        self.data_column = column_names[values][ages];

        // Get max for coloring and legend
        self.data_max = minMax[self.data_column]['max'];
        if( self.data_max % 10 == 0 ){
            self.data_max += 10; // make 10 larger if already a 10
        } else {
            self.data_max = Math.ceil(self.data_max/10)*10; // round up to nearest 10
        }

        // Fire it up!
        self.onReady();
    },
    onReady: function(){
        var self = this;

        var data_column = self.data_column;

        L.mapbox.accessToken = 'pk.eyJ1IjoibXJzaG9yZXMiLCJhIjoiZDQwYjc2ZjJlOTM1YTlhMjI4N2JlNDg2ODI0NTlkMTcifQ.rlAJW20fwjEB8H9ptH1bNA';

        var map = L.mapbox.map('map', 'mapbox.streets')
                          .setView([37.4, -118], 6);

        // MapBox interaction disable
        map.scrollWheelZoom.disable();

        var popup = new L.Popup({ autoPan: false });

        // featureData of geoJSON comes from the 'ca-county.js' script in index.php
        var countyLayer = L.geoJson(featureData,  {
            style: getStyle,
            onEachFeature: onEachFeature,
            // filter: filterFeatures
        }).addTo(map);


        /* Set styles for each GeoJSON feature
        ----------------------------------------------------------------------*/
        function getStyle(feature) {

            var name = feature.properties.name;
            var value = self.jsonData[name][data_column];

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
                click: clickHandler
            });
            layer.is_selected = false;
        }


        var closeTooltip;

        function clickHandler(e){
            var layer = e.target,
                title = layer.feature.properties.title;
                slug = title.toLowerCase().replace(/\s+/g, '-');

            // Swap value of is_selected
            layer.is_selected = !layer.is_selected;

            // highlight feature
            if( layer.is_selected ){
                layer.setStyle(selectedStyle);
            } else {
                layer.setStyle(hoverStyle);
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

        function mousemove(e) {
            var layer = e.target,
                title = layer.feature.properties.title,
                name = layer.feature.properties.name,
                value = self.jsonData[name][data_column],
                unit_text = 'rate per 10,000';

            if( self.feature_type == 'rate' ){
                unit_text = 'rate per 10,000';
            } else {
                unit_text = 'total ED visits';
            }

            popup.setLatLng(e.latlng);
            popup.setContent('<div class="marker-title">' + title + ' County</div>' +
                '<strong>' + value + '</strong> ' + unit_text);

            if (!popup._map) popup.openOn(map);
            window.clearTimeout(closeTooltip);

            // highlight feature
            if( !layer.is_selected ){
                layer.setStyle(hoverStyle);
            }

            if (!L.Browser.ie && !L.Browser.opera) {
                layer.bringToFront();
            }
        }

        function mouseout(e) {
            var layer = e.target;

            closeTooltip = window.setTimeout(function() {
                map.closePopup();
            }, 100);

            if( !layer.is_selected ){
                countyLayer.resetStyle(layer);
            }
        }

        map.legendControl.addLegend(getLegendHTML());


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

            return '<span>Rate per 10,000</span><ul>' + labels.join('') + '</ul>';
        }


        /* Add Attribution
        ------------------------------------------------------------*/

        map.attributionControl.addAttribution('Data from ' +
            '<a href="#">CHCF</a>');
    },
} // end var MBox
