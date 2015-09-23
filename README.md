# 2012 Asthma Emergency Department Visits

## General

**URL Root**

There is PHP variable `$rootURL` at the top of `index.php` that should be set to the full base URL of the site. It's used as a base for social sharing URLs, and by mapbox_script.js to load to zip code topoJSON. **The site will not work without the correct $rootURL value in index.php**.

**Dependencies**

* Google Fonts - CDN - Lato typeface
* Bootstrap 3 - CDN - general CSS
* jQuery - CDN - general JS use
* BxSlider - local - slide section
* StackIcons - local - icon font for social sharing icons
* mapbox.js - CDN - Mapbox javascript API
* Leaflet Omnivore - CDN - Mapbox plugin to read/convert topoJSON
* D3.js - local - Used for histogram in slides

## Slide Section

The slider is powered by BxSlider, a jQuery plugin for responsive slide shows.

Slide navigation is handled by custom script (`js/slides.js`) to allow the histogram element to toggle and update as needed.

All of the slide HTML is in `includes/section_overview_slides.php`, which is included with PHP into the `includes/section_overview.php` parent.

The histogram markup is not included within the slides, but is an HTML container positioned absolutely *over* the slides.

**Adding New Slides**

New slide markup can be added to `includes/section_overview_slides.php`.

To initialize a slide, an update method must be added to to the function array within **updateSlides()** in `slides.js`. The key value of the array should be the 0-indexed equivalent of the slide's number. The indexes of other functions in **updateSlides()** will need to be adjust if inserting a slide in between already existing slides.

## MapBox

The map is generated using MapBox, and manipulated with `mapbox.js`. The county shapes load via geoJSON from `js/ca-counties.js`. The zip code shapes load via leaflet omnivore in `js/mapbox_script.js` as topoJSON in the file `CA_2010_ZCTA5CE.sjon`.

## Social Sharing

Twitter card tags and Facebook open graph meta tags are inserted into `includes/head.php` based on GET variable `slide` taken from `index.php`. The head file includes `includes/social_meta.php`, which uses the value of `slide` to insert Twitter/Facebook title, description, and image into the meta tags from an array.

The top header shares the first slide (`$slide` is initialized to 1 if no GET variable is passed for `?slide=` in `index.php`).

The map social icons share the set controls of the map (combination of *age* and *map* choice) through a GET variable `map`. The map will load with the correct choice based on the URL value, and initializes to Possible values are:

* **county0** - county map, youth 0-17
* **county 18** - county map, adults
* **countyall** - county map, all ages
* **zip0** - zip code map, youth 0-17
* **zip18** - zip code map, adults
* **zipall** - Zip code map, all ages