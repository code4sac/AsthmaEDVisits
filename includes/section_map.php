    <div class="container-fluid">
        <div class="row">
            <div class="col-sm-9">
                <h2><span>Interactive</span> Asthma Rates by Geography</h2>
                <p>The map below shows 2012 emergency department visit rates for California counties and zip codes. Use the options on the side to toggle between age groups and map type. You can download the full data set, or select individual counties/zips to download.</p>
            </div>
        </div>

        <div class="row">
            <div class="col-sm-12">

                <div class="map_wrap">
                    <div class="map_title">
                        <div class="title">2012 Emergency Department Visit Rates</div>
                        <div class="social">
                            <?php
                                $url = urlencode($rootUrl) . '?map=' . $map_hash;
                                $text = urlencode('Asthma Emergency Department Visits in California');
                            ?>
                            <a href="http://facebook.com/sharer.php?t=<?php echo $text ?>&amp;u=<?php echo $url ?>"
                                class="st-icon-facebook-alt st-icon-circle" target="_blank">Facebook</a>
                            <a href="https://twitter.com/intent/tweet?text=<?php echo $text ?>&amp;via=<?php echo urldecode('CAHealthData') ?>&amp;url=<?php echo $url ?>"
                                class="st-icon-twitter st-icon-circle" target="_blank">Twitter</a>
                        </div>
                    </div>

                    <div id="map"></div>

                    <div id="map_form">
                        <h3>Options</h3>
                        <form id="mapForm" method="GET">
                            <select class="form-control" name="map">
                                <option value="county">
                                    County Map
                                </option>
                                <option value="zip">
                                    Zip Code Map
                                </option>
                            </select>
                            <select class="form-control" name="ages">
                                <option value="0">
                                    Ages 0&ndash;17
                                </option>
                                <option value="18">
                                    Ages 18+
                                </option>
                                <option value="all">
                                    All Ages
                                </option>
                            </select>
                        </form>

                        <div class="selected_wrap">
                            <h3>Selected</h3>
                            <p><em>No areas selected.</em></p>
                            <div id="selected"></div>
                        </div>

                        <a class="download btn btn-success btn-sm" href="#">
                            <span class="glyphicon glyphicon-download"></span> Download Selected <span class="mobilehide">Data</span>
                        </a>
                    </div>
                </div><!-- .map_wrap -->

            </div>
        </div><!-- .row -->
    </div><!-- .container -->