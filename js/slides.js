
function slideShow(jsonDataCounty, jsonDataZip, maxRate, GET_slide){

    var slides = Slides.init(jsonDataCounty, jsonDataZip, maxRate, GET_slide);

    slides.slider = jQuery('.bxslider').bxSlider({
        mode: 'fade',
        infiniteLoop: false,
        pager: false,
        speed: 200,
        controls: false,
        onSliderLoad: function(){
            // slides.slider = this;
        },
    });

    window.setTimeout(goToSlidesSlider, 1000);

    function goToSlidesSlider(){
        slides.goToGetUrlSlide(slides.slider);
    }
}

/*------------------------------------------------------------------------------
    :: Slides objects for custom animations
------------------------------------------------------------------------------*/

var Slides = {
    init: function(jsonDataCounty, jsonDataZip, maxRate, GET_slide){
        var self = this;
        self.GET_slide = GET_slide;

        // Data sets
        self.jsonDataCounty = jsonDataCounty;
        self.jsonDataZip = jsonDataZip;
        self.data_max = maxRate;

        // Slide info.
        self.current = 0;
        self.next = self.current + 1;
        self.prev = self.current - 1;
        self.max_slides = 11;

        // Initialize controls
        self.initControls();

        // Draw histogram on first geography slide
        self.initHistogram('county', 'rate_18');

        return self;
    },
    goToGetUrlSlide: function(slider){
        var self = this;

        if( self.GET_slide != 0 ){
            // Target 1 less than requested slide since 
            self.current = self.GET_slide - 1;
            self.next = self.current + 1;
            self.previous = self.current - 1;

            self.slider = slider;

            self.updateCount();
            self.updateSlides('next');

            // slider.goToNextSlide()
        }
    },
    initControls: function(){
        var self = this;

        // Prev" and "Next" arrows
        jQuery('.slide_nav').find('.prev a')
                            .on('click', function(event){
                                event.preventDefault();
                                self.prevSlide();
                            }).end()
                            .find('.next a')
                            .on('click', function(event){
                                event.preventDefault();
                                self.nextSlide();
                            });
        // "Continue" link on first slide
        jQuery('.slide.start a.continue').on('click', function(){
            event.preventDefault();
            self.nextSlide();
        });
    },

    /* Histogram
    --------------------------------------------------------------------------*/
    initHistogram: function(map, age){
        var self = this;

        self.svg_height = 250;
        // Get width of a col-sm-5 width slide element !!! Hidden slides have 0 width
        self.svg_width = jQuery('.geography .col-sm-5').outerWidth();

        var values = self.makeHistorgramData(map, age);

        var margin = {top: 45, right: 10, bottom: 60, left: 45},
            width = self.svg_width - margin.left - margin.right,
            height = self.svg_height - margin.top - margin.bottom;

        var data_max = self.data_max;

        // A formatter for counts.
        var formatCount = d3.format(",.0f");

        var x = d3.scale.linear()
            .domain([0, 160])
            .range([0, width]);

        // Generate a histogram bins
        var bins = self.makeHistogramBins(values);
        var bin_width = Math.floor(width / 16);

        var tickValues = [];
        for( var j = 0; j < 16; j++){
            tickValues.push(bins[j].x);
        }

        var xAxis = d3.svg.axis()
            .scale(x)
            .tickValues(tickValues)
            .tickFormat(function(d, idx){
                // Skip the odd number ticks
                if( idx % 2 != 1 ){
                    // make 140 unique
                    if( d == 140 ){
                        return d + '+';
                    } else {
                        return d;
                    }                    
                }
            })
            .orient('bottom');

        var y = d3.scale.linear()
            .domain([0, d3.max(bins, function(d) { return d.count; })])
            .range([height, 0]);

        /* SVG Graphic
        ----------------------------------------------------------------------*/

        var svg = d3.select('.histogram').append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
          .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        self.histogram = svg;

        // Bar holder
        var bar = svg.selectAll('.bar')
            .data(bins, function(d, idx){ return idx; })
          .enter().append('g')
            .attr('class', 'bar')
            .attr('transform', function(d, idx) {
                return 'translate(' + bin_width * idx + ',0)';
            });

        // Visible bars
        bar.append('rect')
            .attr('x', 1)
            .attr('y', function(d){
                return y(d.count);
            })
            .attr('width', bin_width - 1)
            .attr('height', function(d) { return height - y(d.count); })
            .attr('fill', function(d, idx){
                return colors[Math.floor(idx/2)];
            });

        // Counts above bars
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

        /* Axis / Label
        ----------------------------------------------------------------------*/

        // x axis
        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis);

        // x axis label
        svg.append('text')
            .attr('class', 'label label_x')
            .attr('x', width - margin.left - 100)
            .attr('y', height + 45 )
            .style('text-anchor', 'middle')
            .text('ED Visit Rate per 10,000');

        // y axis label
        svg.append('text')
            .attr('class', 'label label_y')
            .attr('x', -40)
            .attr('y', -35)
            .attr('transform', 'rotate(-90)')
            .style('text-anchor', 'middle')
            .text('Count')

        // var target_line_offset = 40; // pushes line over within target g
        // var target = svg.append('g')
        //                 .attr('class', 'target')
        //                 .attr('transform', 'translate(0, 0)');

        // target.append('text')
        //         .text('2022 Target');

        // target.append('rect')
        //         .attr('x', target_line_offset)
        //         .attr('y', 7)
        //         .attr('width', 1)
        //         .attr('height', 160)
        //         .attr('fill', '#666666');

        // target.attr('class', 'target show');
    },
    updateHistogram: function(map, age, geo_list){
        geo_list = typeof geo_list !== 'undefined' ? geo_list : [];
        var self = this;

        var values = self.makeHistorgramData(map, age, geo_list);

        var margin = {top: 45, right: 10, bottom: 60, left: 45},
            width = self.svg_width - margin.left - margin.right,
            height = self.svg_height - margin.top - margin.bottom;

        var data_max = self.data_max;

        // A formatter for counts.
        var formatCount = d3.format(",.0f");

        var x = d3.scale.linear()
            .domain([0, 160])
            .range([0, width]);

        // Generate a histogram bins
        var bins = self.makeHistogramBins(values);
        var bin_width = Math.floor(width / 16);

        var tickValues = [];
        for( var j = 0; j < 16; j++){
            tickValues.push(bins[j].x);
        }

        var xAxis = d3.svg.axis()
            .scale(x)
            .tickValues(tickValues)
            .tickFormat(function(d, idx){
                // Skip the odd number ticks
                if( idx % 2 != 1 ){
                    // make 140 unique
                    if( d == 140 ){
                        return d + '+';
                    } else {
                        return d;
                    }                    
                }
            })
            .orient('bottom');

        var y = d3.scale.linear()
            .domain([0, d3.max(bins, function(d) { return d.count; })])
            .range([height, 0]);

        /* SVG Graphic
        ----------------------------------------------------------------------*/

        svg = self.histogram;

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
                .attr('height', function(d){ return height - y(d.count); })
                .attr('fill', function(d, idx){
                    return colors[Math.floor(idx/2)];
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
    },
    makeHistorgramData: function(map, age, geo_list){
        /*  
            `map` = "county", "zip"
            `age` = "rate_0", "rate_18", "rate_all"
            `geo_list` = list of geography ids, like counties or zip codes
        */
        geo_list = typeof geo_list !== 'undefined' ? geo_list : [];
        var self = this;

        if( map == 'county' ){
            var jsonData = self.jsonDataCounty;
        } else {
            var jsonData = self.jsonDataZip;
        }

        // Shorten list to passed in `geo_list`
        if( geo_list.length ){
            var newJsonData = {}
            for( var i = 0; i < geo_list.length; i++ ){
                var id = geo_list[i];
                newJsonData[id] = jsonData[id];
            }
            jsonData = newJsonData;
        }

        var data = [];

        // Loop through geo data
        for( var k in jsonData ){
            if( jsonData.hasOwnProperty(k) && k != 'CALIFORNIA'){
                try {
                    var obj = jsonData[k];
                    data.push([k, obj[age]]); // get for `age`
                } catch(err) {
                    // pass
                }
            }
        }

        return data;
    },
    makeHistogramBins: function(values){
        var self = this;

        var num_bins = 16;
        var interval = 10; // 155.1 max rate => 160 max / 8 bins = 20

        var bins = []
        for( var i = 0; i < num_bins; i++){
            bins.push({count: 0, x: interval*i});
        }

        for( var j = 0; j < values.length; j++ ){
            var val = values[j][1] || 0;

            var idx = Math.floor(val / interval);

            // Handle zips having a higher range
            if( idx >= num_bins ){ idx = num_bins - 1; }
            bins[idx]['count'] += 1;
        }
        return bins;
    },

    /* Show / hide .histogram
    --------------------------------------------------------------------------*/
    showHistogram: function(){
        jQuery('.histogram').addClass('over_slides');
    },
    hideHistogram: function(){
        jQuery('.histogram').removeClass('over_slides');
    },

    /* Slide navigation
    --------------------------------------------------------------------------*/
    prevSlide: function(){
        var self = this;
        // Stop if at first slide
        if( 0 < self.current ){
            self.current = self.current - 1;
            self.next = self.next - 1;
            self.prev = self.prev - 1;

            self.updateCount();
            self.updateSlides('prev');
        }
    },
    nextSlide: function(){
        var self = this;
        // Stop if at last slide
        if( self.current < self.max_slides - 1){
            self.current = self.current + 1;
            self.next = self.next + 1;
            self.prev = self.prev + 1;

            self.updateCount();
            self.updateSlides('next');
        }
    },
    updateCount: function(){
        var self = this;
        // Update slide count, `self.current` is 0-indexed!
        jQuery('.slide_count').find('span.current').html(self.current + 1);
    },
    updateSlides: function(direction){
        var self = this;

        var updaters = {
            0: function(){},
            1: function(){},
            2: how_common,
            3: geography_adult_county,
            4: geography_youth_county,
            5: geography_youth_zip,
            6: geography_imperial_valley,
            7: geography_los_angeles,
            8: geography_san_joaquin,
            9: geography_bay_area,
            10: race_demographics,
        }

        // Call update function for slide number
        updaters[self.current]();

        function how_common(){
            self.hideHistogram();
        }

        function geography_adult_county(){
            self.showHistogram();
            self.updateHistogram('county', 'rate_18');
        }

        function geography_youth_county(){
            self.updateHistogram('county', 'rate_0');
        }

        function geography_youth_zip(){
            self.updateHistogram('zip', 'rate_0');
        }

        function geography_imperial_valley(){
            var zips = [92250, 92231, 92249, 92251, 92227, 92233, 92257, 92274,
                        92253, 92260, 92201, 92277, 92225];
            self.updateHistogram('zip', 'rate_0', zips);
        }

        function geography_los_angeles(){
            var zips = [90001, 90002, 90003, 90004, 90005, 90006, 90007, 90008, 90009, 90010, 90011, 90012, 90013, 90014, 90015, 90016, 90017, 90018, 90019, 90020, 90021, 90022, 90023, 90024, 90025, 90026, 90027, 90028, 90029, 90030, 90031, 90032, 90033, 90034, 90035, 90036, 90037, 90038, 90039, 90040, 90041, 90042, 90043, 90044, 90045, 90046, 90047, 90048, 90049, 90050, 90051, 90052, 90053, 90054, 90055, 90056, 90057, 90058, 90059, 90060, 90061, 90062, 90063, 90064, 90065, 90066, 90067, 90068, 90069, 90070, 90071, 90072, 90073, 90074, 90075, 90076, 90077, 90078, 90079, 90080, 90081, 90082, 90083, 90084, 90086, 90087, 90088, 90089, 90090, 90091, 90093, 90094, 90095, 90096, 90099, 90189, 90201, 90202, 90209, 90210, 90211, 90212, 90213, 90220, 90221, 90222, 90223, 90224, 90230, 90231, 90232, 90233, 90239, 90240, 90241, 90242, 90245, 90247, 90248, 90249, 90250, 90251, 90254, 90255, 90260, 90261, 90262, 90263, 90264, 90265, 90266, 90267, 90270, 90272, 90274, 90275, 90277, 90278, 90280, 90290, 90291, 90292, 90293, 90294, 90295, 90296, 90301, 90302, 90303, 90304, 90305, 90306, 90307, 90308, 90309, 90310, 90311, 90312, 90401, 90402, 90403, 90404, 90405, 90406, 90407, 90408, 90409, 90410, 90411, 90501, 90502, 90503, 90504, 90505, 90506, 90507, 90508, 90509, 90510, 90601, 90602, 90603, 90604, 90605, 90606, 90607, 90608, 90609, 90610, 90637, 90638, 90639, 90640, 90650, 90651, 90652, 90660, 90661, 90662, 90670, 90671, 90701, 90702, 90703, 90704, 90706, 90707, 90710, 90711, 90712, 90713, 90714, 90715, 90716, 90717, 90723, 90731, 90732, 90733, 90734, 90744, 90745, 90746, 90747, 90748, 90749, 90755, 90801, 90802, 90803, 90804, 90805, 90806, 90807, 90808, 90809, 90810, 90813, 90814, 90815, 90822, 90831, 90832, 90833, 90834, 90835, 90840, 90842, 90844, 90846, 90847, 90848, 90853, 90895, 90899, 91001, 91003, 91006, 91007, 91008, 91009, 91010, 91011, 91012, 91016, 91017, 91020, 91021, 91023, 91024, 91025, 91030, 91031, 91040, 91041, 91042, 91043, 91046, 91066, 91077, 91101, 91102, 91103, 91104, 91105, 91106, 91107, 91108, 91109, 91110, 91114, 91115, 91116, 91117, 91118, 91121, 91123, 91124, 91125, 91126, 91129, 91182, 91184, 91185, 91188, 91189, 91199, 91201, 91202, 91203, 91204, 91205, 91206, 91207, 91208, 91209, 91210, 91214, 91221, 91222, 91224, 91225, 91226, 91301, 91302, 91303, 91304, 91305, 91306, 91307, 91308, 91309, 91310, 91311, 91313, 91316, 91321, 91322, 91324, 91325, 91326, 91327, 91328, 91329, 91330, 91331, 91333, 91334, 91335, 91337, 91340, 91341, 91342, 91343, 91344, 91345, 91346, 91350, 91351, 91352, 91353, 91354, 91355, 91356, 91357, 91364, 91365, 91367, 91371, 91372, 91376, 91380, 91381, 91382, 91383, 91384, 91385, 91386, 91387, 91390, 91392, 91393, 91394, 91395, 91396, 91401, 91402, 91403, 91404, 91405, 91406, 91407, 91408, 91409, 91410, 91411, 91412, 91413, 91416, 91423, 91426, 91436, 91470, 91482, 91495, 91496, 91499, 91501, 91502, 91503, 91504, 91505, 91506, 91507, 91508, 91510, 91521, 91522, 91523, 91526, 91601, 91602, 91603, 91604, 91605, 91606, 91607, 91608, 91609, 91610, 91611, 91612, 91614, 91615, 91616, 91617, 91618, 91702, 91706, 91711, 91714, 91715, 91716, 91722, 91723, 91724, 91731, 91732, 91733, 91734, 91735, 91740, 91741, 91744, 91745, 91746, 91747, 91748, 91749, 91750, 91754, 91755, 91756, 91765, 91766, 91767, 91768, 91769, 91770, 91771, 91772, 91773, 91775, 91776, 91778, 91780, 91788, 91789, 91790, 91791, 91792, 91793, 91801, 91802, 91803, 91804, 91896, 91899, 93510, 93532, 93534, 93535, 93536, 93539, 93543, 93544, 93550, 93551, 93552, 93553, 93563, 93584, 93586, 93590, 93591, 93599];
            self.updateHistogram('zip', 'rate_0', zips);
        }

        function geography_san_joaquin(){
            //http://www.zip-codes.com/county/CA-SAN-JOAQUIN.asp
            var zips = [95201, 95202, 95203, 95204, 95205, 95206, 95207, 95208, 95209, 95210, 95211, 95212, 95213, 95215, 95219, 95220, 95227, 95230, 95231, 95234, 95236, 95237, 95240, 95241, 95242, 95253, 95258, 95267, 95269, 95296, 95297, 95304, 95320, 95330, 95336, 95337, 95366, 95376, 95377, 95378, 95385, 95391, 95686];
            self.updateHistogram('zip', 'rate_0', zips);
        }

        function geography_bay_area(){
            self.showHistogram();
            // https://www.quora.com/What-are-all-the-zip-codes-of-the-Bay-Area
            var zips = [94102, 94103, 94104, 94105, 94107, 94108, 94109, 94110, 94111, 94112, 94114, 94115, 94116, 94117, 94118, 94121, 94122, 94123, 94124, 94127, 94129, 94130, 94131, 94132, 94133, 94134, 94158, 94924, 94925, 94920, 94913, 94904, 94901, 94903, 94949, 94948, 94947, 94946, 94945, 94037, 94941, 94558, 94940, 94939, 94938, 94563, 94937, 94933, 94930, 94929, 94928, 94970, 94971, 94972, 95471, 94960, 94963, 94703, 94105, 94964, 94965, 94705, 94956, 95476, 94957, 94950, 94952, 94953, 90266, 94973, 95650, 94602, 95012, 94134, 95023, 94403, 94402, 94401, 94404, 94112, 94107, 94102, 94303, 94301, 94089, 89431, 94074, 94080, 94066, 94070, 94062, 94063, 94065, 94014, 94013, 94015, 94018, 94020, 94019, 94920, 94021, 94024, 94025, 94028, 94027, 94030, 94553, 94037, 94038, 94044, 94060, 94061, 94541, 97701, 46123, 21401, 94002, 94011, 94005, 94010, 95002, 95008, 95013, 95014, 95020, 94022, 94024, 95030, 95032, 95035, 95037, 95140, 94040, 94041, 94043, 94301, 94304, 94306, 95117, 95118, 95119, 95120, 95121, 95122, 95123, 95124, 95125, 95148, 95126, 95127, 95128, 95129, 95130, 95131, 95132, 95133, 95110, 95111, 95134, 95135, 95136, 95112, 95113, 95116, 95138, 95139, 95046, 95050, 95051, 95053, 95054, 95070, 94305, 94085, 94086, 94087, 94089, 94509, 94806, 94513, 94553, 94521, 94531, 94804, 94582, 94520, 94561, 94583, 94523, 94526, 94801, 94549, 94518, 94598, 94803, 94547, 94530, 94506, 94597, 94596, 94519, 94564, 94563, 94595, 94556, 94507, 94805, 94517, 94572, 94525, 94511, 94575, 94528, 94548, 94516, 94569, 94522, 94524, 94527, 94529, 94570, 94802, 94807, 94808, 94820, 94850, 94505, 94601, 94597, 94604, 94605, 94502, 94602, 94503, 94603, 94589, 94587, 94588, 95628, 94514, 94618, 94403, 94621, 95035, 94619, 94609, 94501, 94608, 94607, 94606, 94613, 94612, 93292, 94611, 94610, 94661, 94702, 94703, 94704, 94705, 94660, 95666, 94806, 94707, 94706, 94709, 94708, 94062, 94710, 94720, 94577, 94580, 94578, 95129, 95128, 94579, 94586, 94582, 94557, 94555, 94560, 94558, 94565, 94568, 94566, 94537, 94538, 94539, 94541, 94542, 94544, 94545, 95391, 94546, 95603, 94550, 94551, 94552, 95377, 95376, 94536, 94599, 94573, 94508, 94576, 94574, 94503, 94590, 95442, 95476, 94515, 94591, 94559, 95687, 94558, 94562, 94533, 94567, 95461, 95430, 95433, 95436, 95439, 95441, 95442, 94515, 95444, 95445, 95446, 95409, 95412, 95416, 95419, 95421, 95422, 95425, 94611, 94109, 95465, 95471, 95472, 95480, 95473, 95476, 95486, 95450, 95448, 95452, 95462, 94926, 94922, 94923, 94574, 95497, 13329, 94558, 95492, 94565, 94931, 95330, 94928, 95407, 95406, 94972, 95405, 95404, 95403, 95402, 95401, 94954, 94951, 94952, 94158, 94510, 94571, 94503, 95625, 94589, 94590, 94585, 95694, 94512, 94591, 94592, 95690, 95616, 95618, 94553, 94561, 95620, 94559, 95688, 94558, 95687, 94565, 93501, 95918, 94534, 94533, 94535, 94505, 95361, 95252, 95254, 95253, 95236, 95234, 95240, 95237, 95242, 95126, 95351, 95632, 95690, 93660, 95227, 95825, 95686, 95230, 95231, 95215, 95219, 95336, 95220, 95337, 95330, 95320, 95391, 95385, 95202, 95203, 95204, 95304, 95205, 95377, 95376, 95258, 95210, 95212, 95297, 95206, 95207, 95648, 95366, 95208, 95296, 95367, 95209, 95010, 95051, 95060, 95020, 95019, 95062, 95018, 95065, 95017, 95064, 95067, 95066, 95073, 95005, 95033, 95076, 95030, 95007, 95006, 95003, 95041, 94060, 95075, 95004, 95020, 93210, 95043, 95024, 95023, 93930, 95045];
            self.updateHistogram('zip', 'rate_0', zips);
        }

        function race_demographics(){
            self.hideHistogram();
        }

        /* Change slide
        ----------------------------------------------------------------------*/
        self.slider.goToSlide(self.current);
    },
}


















