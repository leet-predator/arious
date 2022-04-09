var host = window.location.protocol + "//" + window.location.host;
var intro_play_btn = $('.intro-play');
var intro_pause_btn = $('.intro-pause');
var intro_soundon_btn = $('.intro-sound-on');
var intro_soundoff_btn = $('.intro-sound-off');
var intro_state = 'start';
var intro_paused_at = 0;
var intro_video_visible = true;
var intro_content = $('.intro-content');
var ufo_package = $('.ufo-package');
var explore_btn = $('.explore-btn')
var click_audio = new Audio(`${host}/assets/audios/button-hit.wav`);
var preloader_audio = new Audio(`${host}/assets/audios/space-drift.mp3`);


// detect if in view port
$.fn.isInViewport = function() {
    var elementTop = $(this).offset().top;
    var elementBottom = elementTop + $(this).outerHeight();

    var viewportTop = $(window).scrollTop();
    var viewportBottom = viewportTop + $(window).height();

    return elementBottom > viewportTop && elementTop < viewportBottom;
};


// Scroll or resize check 
$('.app').on('resize scroll', function() {
    if ($('.intro').isInViewport()) {
        intro_video_visible = true;
    } else {
        intro_video_visible = false;
        if (intro_state == 'playing') {
            intro_paused_at = intro_video.currentTime;
            intro_video.pause();
            intro_video.currentTime = 16;
            intro_mouseParalex(true);
            intro_play_btn.show();
            intro_pause_btn.hide();
        }
    }





});


function clickSound() {
    click_audio.play();

}

function driftsound(state) {
    if (state) {
        preloader_audio.play();
    } else {
        preloader_audio.pause();

    }
}



function AppStart() {
    driftsound(false);
    clickSound();
    preloader(false);
    intro_video.muted = true;
    intro_video.play();
    intro_state = 'playing';
}


var explore_follow = '';

explore_btn.click(function() {
    explore_follows(false);
    AppStart();
});

function explore_follows(state) {
    if (state) {
        document.addEventListener("mousemove", (event) => {
            let mousex = event.clientX; // Gets Mouse X
            // var screenWidth = window.innerWidth;
            let mousey = event.clientY; // Gets Mouse Y
            explore_btn.css({ 'left': `${mousex - 40}px`, 'top': `${mousey-40}px` });

        });
    } else {
        explore_btn.hide();
    }
}

// on video sequence End
intro_video.addEventListener('ended', function(e) {
    intro_video.currentTime = 16;

    intro_mouseParalex(true);
})

// debounce 
function debounce(cb, delay = 200) {
    let timeout;

    return (...args) => {
        clearInterval(timeout);
        timeout = setTimeout(() => {
            cb(...args)
        }, delay);
    }
}

// throttle
function throttle(cb, delay = 60) {
    let shouldWait = false;
    let waitingArgs

    const timeoutFunc = () => {
        if (waitingArgs == null) {
            shouldWait = false;
        } else {
            cb(...waitingArgs);
            waitingArgs = null;
            setTimeout(timeoutFunc, delay);
        }
    }

    return (...args) => {
        if (shouldWait) {
            waitingArgs = args
            return
        }

        cb(...args)
        shouldWait = true;

        setTimeout(timeoutFunc, delay);

    }
}

var updateUfoPosition = debounce((position) => {
    ufo_package.animate({ 'left': `${position.left}px`, 'top': `${position.top}px` }, 600);
})

// ufo anker 
$('.app').scroll(function() {
    $('.ufo-anker').each(function() {
        var el = $(this);

        if (el.isInViewport()) {
            let position = {
                left: el.offset().left - $(document).scrollTop() + (el.width() / 2),
                top: el.offset().top - $(document).scrollTop(),
            }
            updateUfoPosition(position);

        } else {
            // ufo_package.css({ 'left': `0px`, 'top': `0px` });
        }
    });
});


function preloader(state) {
    if (state) {
        $('.preloader').fadeIn();
    } else {
        $('.preloader').fadeOut();
    }
}



//  app start with preload
function preloader_animate() {
    var preloader_ufo = '';
    preloader_ufo = $('.preloader').find('.ufo');
    var preloader_ufo_light = $('.preloader').find('.ufo-light');
    var preloader_ufo_orbs = $('.preloader').find('.orbs');

    var path = "M1289.63.36c-144.9,140.66-272.83,181.74-361,194-82.46,11.46-220.77-15.2-494-69-191.07-37.62-291.21-62.13-369-2-37.35,28.87-74.51,81.09-63,126,15.6,60.91,115.62,88.53,189,78,84.33-12.11,134.12-74.7,147-92"; // an SVG path
    // pathAnimator,
    var startFromPercent = 0; // start from 10% of the path
    var stopAtPercent = 100; // stop at 70% of the path (which will then call the onDone function callback)


    // initiate a new pathAnimator object
    var pathAnimator = new PathAnimator(path, {
        duration: 5, // seconds that will take going through the whole path
        step: step,
        easing: function(t) {
            return t * (2 - t)
        },
        onDone: finish(this)
    });

    pathAnimator.start(startFromPercent, stopAtPercent);

    // function start() {
    //     pathAnimator.start(startFromPercent, stopAtPercent);

    // }

    function step(point, angle) {
        // do something every "frame" with: point.x, point.y & angle
        // console.log(point);
        preloader_ufo.css({
            'top': point.y,
            'left': point.x
        });
    }

    function finish() {
        // this.start();
        // do something when animation is done
        // alert('okay');
        $('.preloader').trigger('click');
        setTimeout(() => {
            preloader_ufo.animate({
                'top': 0,
                'left': 0
            }, 2000, function() {
                // console.log('hello');
                driftsound(true);

                preloader_ufo_light.animate({
                    "opacity": 1
                }, 800, function() {
                    console.log('hello');
                    preloader_ufo_orbs.animate({
                        "opacity": 1,
                        "margin-top": "-150px",
                        // "transform": "scale(1)"
                    }, 400, function() {
                        setTimeout(() => {
                            // $('.preloader').fadeOut();
                            explore_btn.show();
                            explore_follows(true);
                        }, 1000);;
                    });
                });
            });
        }, 4500);

    }
}

var global_ptime = 0;
var delay = 0;
var introdelayinterval = setInterval(() => {
    delay += (global_ptime - delay) * 0.1;
    // console.log(global_ptime + "--" + delay);
    if (intro_video_visible) {
        intro_video.currentTime = delay;

    }

}, 41.6);
clearInterval(introdelayinterval);

function intro_mouseParalex(state) {
    if (state) {
        intro_content.show();

        // animate intro with mouse 
        document.addEventListener("mousemove", (event) => {
            let mousex = event.clientX; // Gets Mouse X
            var screenWidth = window.innerWidth;
            // let mousey = event.clientY; // Gets Mouse Y


            global_ptime = videotimesetter = mapper(0, screenWidth, 14, 18, mousex)
                // global_ptime = videotimesetter = map(mousex, 0, screenWidth, 14, 18)



        });
        introdelayinterval = setInterval(() => {
            delay += (global_ptime - delay) * 0.1;
            // console.log(global_ptime + "--" + delay);
            if (intro_video_visible) {
                intro_video.currentTime = delay;

            }

        }, 41.6);



    } else {
        intro_content.hide();

        clearInterval(introdelayinterval);
        // document.removeEventListener("mousemove", (event) => {
        // });
    }

}

// handle controlls intro
intro_pause_btn.click(function() {
    intro_paused_at = intro_video.currentTime;
    intro_video.pause();
    intro_video.currentTime = 16;
    intro_mouseParalex(true);
    intro_play_btn.show();
    intro_pause_btn.hide();
    intro_state = 'paused';
});

intro_play_btn.click(function() {
    intro_video.play();
    intro_video.pause();
    intro_video.play();

    intro_video.currentTime = intro_paused_at;
    intro_mouseParalex(false);
    intro_pause_btn.show();
    intro_play_btn.hide();
    intro_state = 'playing';

});

intro_soundoff_btn.click(function() {
    intro_video.muted = true;
    // intro_soundoff_btn.hide();
    // intro_soundon_btn.show();

});

intro_soundon_btn.click(function() {
    intro_video.muted = false;
    // intro_soundoff_btn.show();
    // intro_soundon_btn.hide();

});


function mapper(a, b, x, y, current) {
    var c = b / current;
    var z = y - x;
    var ans = Math.floor(z / c);
    return x + ans;
}

function map(num, in_min, in_max, out_min, out_max) {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}


// sidebar
function sidebar(state) {
    var sidebar = $('.side-menu');
    if (state) {
        sidebar.fadeIn();

    } else {
        sidebar.fadeOut();
    }
}

function reduce_text(text, count) {
    return text.slice(0, count) + (text.length > count ? "..." : "");
}


// more description 

$('.more-desc-btn').click(function() {
    $(this).parent().find('.more-desc').fadeIn();
});

$('.close-desc').click(function() {
    $(this).parent().fadeOut();
});


/// ready state 

$(document).ready(function() {



    $('.full-height-section .desc').each(function() {
        $(this).html(reduce_text($(this).text(), 300));
    });
    starnight();

});


function starnight() {
    particlesJS("particles-js", {
        "particles": {
            "number": {
                "value": 600,
                "density": {
                    "enable": true,
                    "value_area": 789.1476416322727
                }
            },
            "color": {
                "value": "#e3c896"
            },
            "shape": {
                "type": "circle",
                "stroke": {
                    "width": 0,
                    "color": "red"
                },
                "polygon": {
                    "nb_sides": 5
                },
                "image": {
                    "src": "img/github.svg",
                    "width": 100,
                    "height": 100
                }
            },
            "opacity": {
                "value": 0.9,
                "random": false,
                "anim": {
                    "enable": true,
                    "speed": 0.9,
                    "opacity_min": 0,
                    "sync": false
                }
            },
            "size": {
                "value": 2,
                "random": true,
                "anim": {
                    "enable": true,
                    "speed": 2,
                    "size_min": 0,
                    "sync": false
                }
            },
            "line_linked": {
                "enable": false,
                "distance": 150,
                "color": "#ffffff",
                "opacity": 0.4,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 0.6,
                "direction": "none",
                "random": true,
                "straight": false,
                "out_mode": "out",
                "bounce": false,
                "attract": {
                    "enable": false,
                    "rotateX": 600,
                    "rotateY": 1200
                }
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": true,
                    "mode": "bubble"
                },
                "onclick": {
                    "enable": true,
                    "mode": "push"
                },
                "resize": true
            },
            "modes": {
                "grab": {
                    "distance": 400,
                    "line_linked": {
                        "opacity": 1
                    }
                },
                "bubble": {
                    "distance": 90,
                    "size": 1,
                    "duration": 3,
                    "opacity": 1,
                    "speed": 3
                },
                "repulse": {
                    "distance": 200,
                    "duration": 0.4
                },
                "push": {
                    "particles_nb": 4
                },
                "remove": {
                    "particles_nb": 2
                }
            }
        },
        "retina_detect": true
    });
}


// Author 
// Usama tariq 
// leet@usama.live
// to Arious Holding 
// Storak Digital