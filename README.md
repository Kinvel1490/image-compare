<h1 align="center">Image compare<h1>
Usage:

```HTML
<head>
    <link rel="stylesheet" href="./image_compare.css">
</head>
<body>
    <div class="compare">
        <div class="compare_galery_wrapper">
            <div class="compare_static">
                <img class="compare_static_image" src="" alt="">
            </div>
            <div class="compare_resizable">
                <img class="compare_resizable_image" src="" alt="">
            </div>
            <div class="control_wrapper"></div>
        </div>
    </div>
<script src="./image_compare.js"></script>
</body>
```
Then in your script:

```javascript
new imageComparator (document.querySelector('.compare'), [options]);
```

Full HTML structure: 
```HTML
    <div class="compare">
        <div class="compare_galery_wrapper">
            <div class="compare_static">
                <img class="compare_static_image" src="" alt="">
            </div>
            <div class="compare_resizable">
                <img class="compare_resizable_image" src="" alt="">
            </div>
            <div class="control_wrapper"></div>
            <span class="compare_next copmare_contorl_btn contorl_btn_next"></span>
            <span class="compare_prev copmare_contorl_btn contorl_btn_prev"></span>
        </div>
        <div class="compare_thmb_wrapper">
            <img src=""
                fullSize=""
                compare=""
                alt=""
                class="compare_thumb"
            >
            <span class="thumbs_compare_next copmare_contorl_btn contorl_btn_next"></span>
            <span class="thumbs_compare_prev copmare_contorl_btn contorl_btn_prev"></span>
        </div>
    </div>
</code>
```
In the &lt;img&gt; fullsize and compare attributes are required. <code>fullsize</code> attribute must contain a link to a fullsize image which will be displayed on a background, and <code>compare</code> attribute must contain source of comparing image. You can make as much <code>&lt;img class="compare_thumb"&gt;</code> as you need.

The options is the object with following properties: 

```javascript
navigation: true | false // show | hide navigation buttons (default false)
thumbs: true | false // show | hide thumbnails (default false)
thumbsNavigation:  true | false // show | hide thumbnails navigation buttons (default false)
thumbsCount: Number // number of thumbnails to display (default 4)
thumbsSpace: Number // space between thumbnails in pixels (default 15)
thumbsPerSlide: Number // count of thumbnals shifting by thumbs navigation buttons
initialSlide: Number // fisrt slide to show
speed: Number // animation time in ms
easing: standart CSS easing timing functions // scroll animation easing
staticImage: String // background (static) image class name
resizableImage: String // foreground (resizable) image class name
resizableClass: String // foreground (resizable) image container class name
controllerClass: String // class name of the controll div-element (hovers the images)
thumbsContainer: String // thumbnails container class
navigationNext: String // navigation button class
navigationPrev: String // navigation button class
thumbsNavigationNext: String // thumbnails navigation button class
thumbsNavigationPrev: String // thumbnails navigation button class
thumbClass: String // thumbnails images class
```
