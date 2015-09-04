<?php

/* Output social links with slide GET value 
 *
*/
function slide_social($index, $rootUrl){
    $url = urlencode($rootUrl);
    if( $index != 0 ){
        $url .= urlencode('?slide=' . $index);
    }
    $text = urlencode('Asthma Emergency Department Visits in California');
    ?>

    <div class="slide_social">
        <a href="http://facebook.com/sharer.php?u=<?php echo $url ?>&amp;t=<?php echo $text ?>"
            target="_blank"
            class="st-icon-facebook-alt st-icon-circle">Facebook</a>
        <a href="https://twitter.com/intent/tweet?url=<?php echo $url ?>&amp;text=<?php echo $text ?>&amp;via=<?php echo urldecode('CAHealthData') ?>"
            class="st-icon-twitter st-icon-circle"
            target="_blank">Twitter</a>
    </div>
    <?php
}
?>


<li class="slide start">

    <?php slide_social(1, $rootUrl) ?>

    <div class="row">
        <div class="col-sm-10 col-sm-offset-1">
            <h3><span>Overview</span>What is Asthma?</h3>
            <p>Asthma is one of the most common chronic diseases and has been recognized as a growing public health concern. The effects of asthma include <strong>missed school</strong> and <strong>work days</strong>, disruption of sleep and daily activities, <strong>urgent medical visits</strong> for asthma exacerbations, and even death.</p>
            <a href="#" class="continue">CONTINUE <span class="glyphicon glyphicon-chevron-right"></span></a>            
        </div>
    </div>    
</li>




<li class="slide measured">

    <?php slide_social(2, $rootUrl) ?>

    <div class="row">
        <div class="col-sm-12">
            <h3>How is Asthma <strong>Measured</strong>?</h3>
        </div>
    </div>
    <div class="row">
        <div class="col-sm-5">
            <div class="text">
                <p>As with any disease, there are many ways to measure asthma severity in the population. Surveys reveal that about <strong>5 million Californians have asthma</strong>.</p>
                <p>A subset of these sufferers will experience severe uncontrolled symptoms in a given year that cause them to visit a hospital emergency department (ED) for treatment.</p>
                <p>Measuring asthma-related ED visits can reveal the frequency of poorly controlled or severe cases of asthma in the population. Differences in the ED visit rate among different populations can suggest how to target additional investments in asthma care.</p>
            </div>
        </div>
        <div class="col-sm-7">
            <img src="img/asthma_pyramid.gif" alt="Asthma indicator pyramid" />
        </div>
    </div>    
</li>


<li class="slide common" data-name="how_common">

    <?php slide_social(3, $rootUrl) ?>

    <div class="row">
        <div class="col-sm-12">
            <h3>How <strong>Common</strong> Are Asthma ED Visits?</h3>
        </div>
    </div>
    <div class="row">
        <div class="col-sm-5">
            <div class="text">
                <p>In 2012, there were about <strong>185,831</strong> ED visits for asthma in California, or <strong>49.8 per 10,000</strong> Californians of all ages. The rate for youth aged 0-17 was much higher, with <strong>79.4</strong> ED visits per 10,000 young Californians.</p>
                <p>The state’s Let’s Get Healthy California initiative has set a target of just <strong>28 youth ED visits</strong> for asthma per 10,000 by <strong>2022</strong>. Reaching this goal would represent an over <strong>65%</strong> cut in the youth ED visit rate over the next seven years.</p>
            </div>
        </div>
        <div class="col-sm-4 col-sm-offset-1">
            <div class="number_box">
                <ul>
                    <li>
                        <div class="number">185,831</div>
                        <div class="number_text">Total ED Visits</div>
                    </li>
                    <li>
                        <div class="number">73.92</div>
                        <div class="number_text">Average Rate Per 10,000,<br>Age 0-17</div>
                    </li>
                    <li>
                        <div class="number">28</div>
                        <div class="number_text">2022 Target Rate Per 10,000,<br>Ages 0-17</div>
                    </li>
                </ul>
            </div>            
        </div>
    </div>    
</li>



<li class="slide geography" data-name="adult_county">

    <?php slide_social(4, $rootUrl) ?>

    <div class="row">
        <div class="col-sm-12">
            <h3>Geography: <strong>Adults</strong></h3>
        </div>
    </div>
    <div class="row">
        <div class="col-sm-5">
            <div class="text">
                <p>Asthma is present throughout the state, though rates vary by location. Adult ED visit rates are somewhat higher in inland counties than in coastal counties.</p>
            </div>
        </div>
        <div class="col-sm-6 col-sm-offset-1">
            <img src="img/slides_county_adult.png" alt="" width="400" height="400" />
        </div>
    </div>    
</li>




<li class="slide geography" data-name="youth_county">

    <?php slide_social(5, $rootUrl) ?>

    <div class="row">
        <div class="col-sm-12">
            <h3>Geography: <strong>Youth Ages 0-17</strong></h3>
        </div>
    </div>
    <div class="row">
        <div class="col-sm-5">
            <div class="text">
                <p>Youth asthma ED visit rates, on the other hand, are much higher statewide and show much more variation among areas. Counties with the lowest rates tend to be northern and rural. Highest rates are counties in the San Joaquin and Imperial valleys.</p>
            </div>
        </div>
        <div class="col-sm-6 col-sm-offset-1">
            <img src="img/slides_county_youth.png" alt="" width="400" height="400" />
        </div>
    </div>    
</li>




<li class="slide geography" data-name="youth_zip">

    <?php slide_social(6, $rootUrl) ?>

    <div class="row">
        <div class="col-sm-12">
            <h3>Geography: <strong>Youth by Zip</strong></h3>
        </div>
    </div>
    <div class="row">
        <div class="col-sm-5">
            <div class="text">
                <p>At the ZIP code level, distinctions among different areas become more pronounced. While youth asthma ED visit numbers are too small in certain areas to report reliable statistics (and thus not shown on the map), the remaining ZIP codes reveal strong geographic patterns.</p>
            </div>
        </div>
        <div class="col-sm-6 col-sm-offset-1">
            <img src="img/slides_zip_youth.png" alt="" width="400" height="400" />
        </div>
    </div>
</li>




<li class="slide geography" data-name="imperial_valley">

    <?php slide_social(7, $rootUrl) ?>

    <div class="row">
        <div class="col-sm-12">
            <h3>Geography: <strong>Imperial Valley</strong></h3>
        </div>
    </div>
    <div class="row">
        <div class="col-sm-5">
            <div class="text">
                <p>Youth asthma ED visits are particularly high in the Imperial Valley, south of the Salton Sea. This area is characterized by low incomes, low insurance coverage rates, and high outdoor air pollutant levels.</p>
            </div>
        </div>
        <div class="col-sm-6 col-sm-offset-1">
            <img src="img/slides_imperial.png" alt="" width="400" height="400" />
        </div>
    </div>    
</li>




<li class="slide geography" data-name="los_angeles">

    <?php slide_social(8, $rootUrl) ?>

    <div class="row">
        <div class="col-sm-12">
            <h3>Geography: <strong>Los Angeles &amp; Inland Empire</strong></h3>
        </div>
    </div>
    <div class="row">
        <div class="col-sm-5">
            <div class="text">
                <p>Youth asthma ED visits in the Los Angeles and Inland Empire areas show the most variation in rates among populations within the same air basin. Among the many potential causes of this variation are differences in indoor air quality and lower levels of adequate preventative care among some populations.</p>
            </div>
        </div>
        <div class="col-sm-6 col-sm-offset-1">
            <img src="img/slides_los_angeles.png" alt="" width="400" height="400" />
        </div>
    </div>    
</li>



<li class="slide geography" data-name="central_valley">

    <?php slide_social(9, $rootUrl) ?>

    <div class="row">
        <div class="col-sm-12">
            <h3>Geography: <strong>San Joaquin Valley</strong></h3>
        </div>
    </div>
    <div class="row">
        <div class="col-sm-5">
            <div class="text">
                <p>Some of the highest rates of youth asthma ED visits are in the central San Joaquin Valley from Merced down to Corcoran. Many of these ZIP codes rank among the most environmentally burdened in the state, characterized by high pollution and vulnerable populations.</p>
            </div>
        </div>
        <div class="col-sm-6 col-sm-offset-1">
            <img src="img/slides_san_joaquin.png" alt="" width="400" height="400" />
        </div>
    </div>    
</li>





<li class="slide geography" data-name="bay_area">

    <?php slide_social(10, $rootUrl) ?>

    <div class="row">
        <div class="col-sm-12">
            <h3>Geography: <strong>San Francisco Bay</strong></h3>
        </div>
    </div>
    <div class="row">
        <div class="col-sm-5">
            <div class="text">
                <p>The map of youth asthma ED visits in the San Francisco Bay Area reveals a pronounced difference among rates in different areas. Most of the areas with extremely high ED visit rates are in the East Bay, though there are some small pockets in San Francisco as well.</p>
            </div>
        </div>
        <div class="col-sm-6 col-sm-offset-1">
            <img src="img/slides_bay_area.png" alt="" width="400" height="400" />
        </div>
    </div>    
</li>




<!-- <li class="slide" data-name="median_income">
    <div class="row">
        <div class="col-sm-12">
            <h3><strong>Asthma ED Visits</strong> per 10,000 by <br><strong>Median Household Income</strong> of ZIP Code</h3>
        </div>
    </div>
    <div class="row">
        <div class="col-sm-5">
            <div class="text">
                <p>While data are not available on the income levels and environmental exposures of each individual asthma sufferer, ZIP codes with lower average incomes and higher environmental burdens also have higher rates of asthma ED visits, on average.</p>
            </div>
        </div>
        <div class="col-sm-7">

        </div>
    </div>    
</li> -->




<li class="slide" data-name="races">

    <?php slide_social(11, $rootUrl) ?>

    <div class="row">
        <div class="col-sm-12">
            <h3><strong>Blacks</strong> Have <strong>Highest</strong> Asthma ED Visit Rates</h3>
        </div>
    </div>
    <div class="row">
        <div class="col-sm-5">
            <div class="text">
                <p>From 2005–2010, asthma ED visit rates among <strong>Blacks</strong> were <strong>3–5 times higher</strong> than among Whites. Furthermore, Blacks are the only race/ethnicity group for which these rates have <strong>increased significantly over time</strong>.</p>
                <p>Whites and Hispanics have similar asthma ED visit rates, while Asians/Pacific Islanders (A/PI) have slightly lower rates. (Hospitalization data do not allow for separating Pacific Islanders from Asians.) American Indians/Alaska Natives (AI/AN) have relatively low asthma ED visit rates, but research has shown that many AI/AN patients are misclassified as another race in hospital records, leading to underestimation of their true ED visit rates.</p>
            </div>
        </div>
        <div class="col-sm-7">
        </div>
    </div>    
</li>