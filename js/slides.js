
function slideShow(jsonDataCounty, jsonDataZip, maxRate, GET_slide){

    var slides = Slides.init(jsonDataCounty, jsonDataZip, maxRate, GET_slide);

    slides.slider = jQuery('.bxslider').bxSlider({
        mode: 'fade',
        infiniteLoop: false,
        pager: false,
        speed: 200,
        controls: false,
        onSlideBefore: function($slideElement, oldIndex, newIndex){
            // Change color of arrows for first slide and last slide
            var data_id = $slideElement.attr('data-id');
            switch( data_id ){
                case 'races':
                    jQuery('.slide_wrap').addClass('disable_right');
                    break;
                case 'start':
                    jQuery('.slide_wrap').addClass('disable_left');
                    break;
                default:
                    jQuery('.slide_wrap').removeClass('disable_left disable_right');
            }
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
            .text('Number of Counties')

        /* 2022 Target line
        ----------------------------------------------------------------------*/

        var target_line_offset = 35; // pushes line over within target g
        var target = svg.append('g')
                        .attr('class', 'target')
                        .attr('transform', 'translate('+ (Math.floor(x(28)) - 35) + ', -28)');

        target.append('text')
                .text('2022 Target');

        target.append('rect')
                .attr('x', target_line_offset)
                .attr('y', 7)
                .attr('width', 1)
                .attr('height', 172)
                .attr('fill', '#666666');
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
                if( jsonData[id] == null ){
                    newJsonData[id] = jsonData[id];
                } else {
                    // console.log(id);
                    // pass
                }
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
    updateYAxisLabel: function(label){
        d3.select('svg .label_y').text(label);
    },

    /* Show / hide .histogram
    --------------------------------------------------------------------------*/
    showHistogram: function(){
        jQuery('.histogram').addClass('over_slides');
    },
    hideHistogram: function(){
        jQuery('.histogram').removeClass('over_slides');
    },
    showYouthTarget: function(){
        d3.select('.histogram svg .target')
          .attr('class', 'target show'); // add class `show`
    },
    hideYouthTarget: function(){
        d3.select('.histogram svg .target')
          .attr('class', 'target'); // remove class `show`
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
            0: function(){}, // empty function
            1: function(){}, // empty function
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
            self.hideYouthTarget();
            self.updateHistogram('county', 'rate_18');
        }

        function geography_youth_county(){
            self.showYouthTarget();
            self.updateHistogram('county', 'rate_0');
            self.updateYAxisLabel('Number of Counties');
        }

        function geography_youth_zip(){
            self.updateHistogram('zip', 'rate_0');
            self.updateYAxisLabel('Number of Zip Codes');
        }

        function geography_imperial_valley(){
            var zips = [92243, 92234, 92240, 92264, 92239, 92201, 92210, 91906, 91948, 92266, 91934, 92257, 92251, 92250, 92211, 91931, 91962, 91963, 92231, 92539, 92004, 92273, 92262, 92270, 92253, 92236, 92561, 92277, 92036, 92249, 92233, 92259, 92225, 92258, 91916, 91905, 92281, 92275, 92260, 92203, 92276, 92086, 92227, 92274, 92283, 92254, 92241, 92066];
            self.updateHistogram('zip', 'rate_0', zips);
        }

        function geography_los_angeles(){
            var zips = [91504, 91606, 90640, 91770, 93535, 90290, 91792, 91789, 91791, 91723, 91773, 91702, 91741, 91765, 90303, 90033, 90032, 90249, 90822, 91355, 91350, 91387, 91001, 91604, 91402, 91030, 91108, 90062, 90293, 90292, 90003, 90056, 90732, 90716, 90805, 90402, 90010, 90073, 91040, 90403, 93550, 92397, 91732, 91731, 92840, 92841, 92647, 92673, 92865, 92866, 92624, 90743, 92373, 92324, 92399, 92394, 92410, 92337, 92313, 92325, 92058, 91306, 91755, 90701, 90241, 90250, 90210, 90004, 90013, 90069, 91384, 90704, 90059, 91601, 91352, 91311, 90068, 90744, 90023, 90016, 90713, 90058, 91006, 90638, 90606, 91016, 91008, 91759, 90602, 91371, 92844, 92843, 92602, 92649, 92637, 92629, 92692, 92614, 92870, 92610, 92530, 92509, 92879, 92881, 92595, 92591, 92223, 92587, 92028, 92345, 92341, 91709, 91761, 91764, 91737, 91708, 92374, 92358, 92408, 92376, 92026, 92003, 92054, 92055, 93064, 91208, 91405, 91406, 91754, 91356, 93536, 91303, 91505, 91301, 91362, 90265, 90221, 90242, 91790, 91706, 91767, 91740, 90301, 90504, 90814, 91302, 90095, 90090, 90006, 90065, 91205, 91203, 91343, 90037, 90712, 90740, 90034, 90094, 90071, 93544, 91326, 90266, 91733, 92821, 90720, 92845, 92807, 92835, 92701, 92663, 92887, 92861, 92662, 92882, 92584, 92507, 91784, 92335, 92407, 92354, 93040, 93065, 91377, 91501, 91335, 91801, 91803, 91201, 91502, 91401, 91316, 91506, 90502, 90262, 90703, 91744, 90304, 90802, 90815, 91010, 90302, 90012, 90014, 91321, 90280, 91104, 91105, 91214, 91202, 91304, 90042, 90041, 90291, 90064, 90067, 90018, 91345, 90245, 90255, 90270, 90630, 91608, 90623, 92683, 92626, 92679, 92832, 92782, 92880, 92562, 91752, 92585, 92553, 92505, 92508, 92356, 91730, 91762, 91763, 91739, 92411, 92316, 92391, 92322, 91775, 91364, 90746, 90061, 91745, 90044, 90808, 90031, 90211, 90048, 90057, 90036, 90710, 90717, 90670, 91101, 91011, 91403, 91207, 91331, 91325, 90506, 90077, 90731, 90066, 90007, 90807, 90011, 90063, 91342, 91042, 93543, 93553, 90040, 91007, 90604, 90660, 90631, 91330, 90079, 91046, 92868, 92808, 92604, 92618, 92630, 92653, 92780, 92657, 92555, 92536, 92570, 92518, 92395, 92308, 92371, 92382, 92404, 92352, 92385, 92061, 93243, 91776, 90745, 90601, 90247, 90260, 90806, 90222, 90813, 90272, 90025, 90017, 90038, 90046, 90029, 91204, 91436, 90027, 90021, 90715, 90212, 93510, 90254, 90603, 90263, 90831, 90680, 92802, 92660, 92606, 90742, 92708, 92675, 92691, 92676, 92804, 92705, 92603, 92823, 92661, 92592, 92860, 92548, 92567, 92392, 92336, 92405, 92082, 93063, 91605, 91367, 93534, 93532, 93552, 90810, 90650, 91748, 91724, 91722, 90803, 90755, 90723, 90020, 90019, 91390, 91381, 90275, 91423, 91206, 90045, 90028, 90230, 90089, 91351, 91354, 90043, 90002, 90005, 90277, 91780, 93563, 92703, 92869, 92805, 92612, 92656, 92677, 92806, 90621, 90620, 92801, 92704, 92625, 92617, 92883, 92582, 92590, 92503, 92504, 92320, 92501, 92557, 92586, 92301, 92307, 92342, 92372, 92368, 91710, 92359, 92346, 92401, 92057, 92059, 93252, 91411, 91307, 93591, 93551, 90220, 90248, 90501, 90706, 90240, 91750, 91768, 91711, 91766, 91746, 90047, 90305, 90804, 90024, 90026, 90049, 90035, 90039, 90274, 91106, 91103, 91107, 91020, 91602, 91607, 91324, 90232, 90015, 90008, 90001, 91344, 91340, 90405, 90404, 90401, 90278, 90022, 90201, 90505, 90503, 90605, 91024, 91210, 90747, 92833, 92867, 92706, 92627, 92620, 92646, 92655, 92672, 92688, 92694, 92678, 92886, 92831, 92707, 92648, 92651, 92532, 92545, 92596, 92563, 92506, 92551, 92571, 92344, 91786, 91701, 92321, 92377, 92311, 92378];
            self.updateHistogram('zip', 'rate_0', zips);
        }

        function geography_san_joaquin(){
            var zips = [93608, 93612, 93630, 93606, 93646, 93664, 93703, 93234, 93616, 93245, 93266, 93202, 95306, 95301, 93660, 93611, 93706, 93618, 93622, 93728, 93701, 93620, 93656, 93242, 93644, 93614, 93615, 93673, 93221, 93223, 93258, 93640, 93609, 93619, 93634, 93721, 93675, 93635, 95348, 95315, 93451, 93277, 93292, 93286, 93272, 93666, 93662, 93621, 93654, 93710, 93727, 93730, 93212, 93204, 93636, 93604, 93653, 93623, 95303, 95365, 93450, 93291, 93631, 93651, 93602, 93711, 93722, 93626, 93601, 95369, 95325, 95334, 95388, 93665, 95380, 95324, 93257, 93247, 93624, 93657, 93720, 93605, 93230, 93669, 93610, 95338, 95374, 95317, 95312, 93930, 93668, 93725, 93705, 93702, 93704, 93726, 93723, 93239, 93637, 93645, 95322, 95341, 95043, 93647, 93267, 93235, 93625, 93210, 93627, 93667, 93650, 93648, 93652, 93638, 93643, 95340, 95333, 93954, 93274];
            self.updateHistogram('zip', 'rate_0', zips);
        }

        function geography_bay_area(){
            self.showHistogram();
            var zips = [94601, 94501, 94560, 94587, 94580, 94514, 94703, 94549, 94595, 94506, 94806, 94801, 94803, 94553, 94530, 94572, 94949, 94939, 94599, 94131, 94124, 94134, 94108, 94130, 95686, 95242, 94070, 94065, 94019, 95138, 95033, 95120, 95136, 95123, 94304, 95073, 95017, 95687, 94590, 95465, 95407, 95476, 94951, 94705, 94602, 94596, 94583, 94804, 94569, 94970, 94933, 94503, 95632, 95680, 95639, 94114, 94110, 95304, 94010, 94015, 94038, 94020, 94085, 95148, 95127, 95119, 95014, 94043, 95129, 95128, 95117, 95007, 95431, 94605, 94502, 94709, 94536, 94538, 94541, 94546, 94505, 94598, 94523, 94597, 95219, 94547, 94850, 94901, 94925, 94960, 94937, 94930, 94971, 94972, 95757, 95693, 94107, 94133, 95376, 95207, 95204, 95385, 95234, 94061, 94027, 94080, 94066, 94044, 94014, 95037, 95008, 95134, 95139, 95065, 95625, 94928, 95452, 95363, 94704, 94552, 94578, 94566, 94586, 94603, 94612, 94706, 94564, 94516, 94957, 94929, 94924, 94950, 95076, 94559, 95641, 95624, 94571, 94118, 94116, 94123, 95209, 95231, 94063, 94402, 94005, 95110, 95070, 95131, 95054, 94089, 95013, 95005, 95006, 95066, 94591, 94609, 94606, 94702, 94539, 94588, 94568, 94610, 94707, 94582, 94521, 94528, 94575, 94947, 94952, 95360, 94558, 95758, 95690, 95615, 95023, 94132, 94158, 94103, 94122, 95330, 94403, 94074, 94021, 94060, 94128, 95032, 95112, 95035, 95126, 95113, 94022, 95003, 94510, 94923, 95442, 94931, 94544, 94545, 94618, 94565, 94519, 94965, 94940, 94941, 94938, 94115, 94109, 94111, 94121, 95203, 95258, 94002, 94028, 95140, 95135, 95111, 94086, 95118, 94024, 95116, 94305, 95053, 95018, 95041, 95064, 95688, 95620, 95612, 94954, 95404, 94922, 95387, 94708, 94555, 95377, 94607, 94611, 94621, 94608, 94613, 94517, 94563, 94518, 94805, 94520, 94920, 94956, 94903, 94904, 94963, 94973, 94946, 95832, 94117, 94105, 95210, 94025, 94404, 94401, 94037, 95020, 95132, 95051, 95125, 95050, 94040, 95002, 95130, 94533, 94535, 94534, 94585, 94592, 94512, 95472, 94619, 94710, 94577, 94542, 94579, 94550, 94551, 95391, 94720, 94507, 94513, 94561, 94511, 94509, 94531, 94556, 94526, 94548, 94525, 94945, 94964, 94589, 94102, 94112, 94129, 94104, 94127, 95206, 95220, 94062, 94303, 94030, 95122, 95121, 95030, 95133, 94087, 94301, 95124, 94041, 94306, 95046, 95060];
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


















