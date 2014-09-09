//namespace
var demo = {};

//controller
demo.controller = function() {
    this.pages = m.prop([]);
    m.request({method: "GET", url: "pages.json"}).then(this.pages);
    console.log(this.pages())
    this.rotate = function() {
        this.pages().push(this.pages().shift())
    }.bind(this)
};

//view
demo.view = function(ctrl) {
    return [
        ctrl.pages().map(function(page) {
            return m("a", {href: page.url}, page.title);
        }),
        m("button.btn.btn-info", {onclick: ctrl.rotate}, "Rotate links")
    ];
};


var prez = {
    title : "Mithril Testing",
    totalSlides : 16,
    classes : ['inverted', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']
}

var app= {};

app.controller = function(){
    var self = this;
    this.slideNumber = m.route.param("slide");
    this.settings = prez;
    this.currentSlide = 1;
    this.currentItem = 0;
    this.content = m.prop([]);
    this.slidePercentage = m.prop(33);
    this.loaded = false;
    self.next = m.prop(true);
    var deserialize = function (value){
        if(value.trim() != "Not found"){
            self.content().push(value);
            return value;
        } else {
            self.next(false);
        }
    };
    for(var i = 1; i < self.settings.totalSlides+1; i++){
        m.request({method: "GET", url: "./slides/slide"+i+".html", deserialize: deserialize});
    }

    this.loadScripts = function(){
        console.log("Scripts ran");
        $.getScript( "../libs/prism/prism.js" )
            .done(function( script, textStatus ) {
                console.log( textStatus );
                Prism.highlightAll();
            })
            .fail(function( jqxhr, settings, exception ) {
                console.log("Failed", exception);
            });
        $.getScript( "./slides/14.js" )
            .done(function( script, textStatus ) {
                console.log( textStatus );
            })
            .fail(function( jqxhr, settings, exception ) {
                console.log("Failed", exception);
            });
//        $.getScript( "./slides/3.js" )
//            .done(function( script, textStatus ) {
//                console.log( textStatus );
//            })
//            .fail(function( jqxhr, settings, exception ) {
//                console.log("Failed", exception);
//            });
    };
    this.init = function(element, isInit, context){
        console.log(element, isInit, context)
        if(!isInit) {
            var width = $('.slide').outerWidth() + 300;
            var wrapW = (width * self.settings.totalSlides) + 40;
            $('.wrap').css('width', wrapW);
            self.resize();
            self.onKey();
            $('[data-index]').hide();
            self.slidePerc();
        }
        if(!self.loaded){
            self.loadScripts();
            //initialize
            m.module(document.getElementById("example"), demo);

        }

        self.loaded = true;

    };
    this.onKey = function() {
        $(document).keydown(function(event){
            event.preventDefault();
            var key = event.which;
            switch (key) {
                case 37 : // left
                    self.prev();
                    break;
                case 39 : // right
                    self.next();
                    break;
                case 38 : // up
                    self.up();
                    break;
                case 40 : // down
                    self.down();
                    break;
            }
        })
    };
    this.resize = function(){
        var height = $(window).height();
        var margin = (height-600-50)/2;
        $('.wrap').css('margin-top', margin + 'px')
    };
    this.prev = function(){
        console.log('Current Slide', self.currentSlide);
        if(self.currentSlide > 1 ){
            self.currentSlide--;
            var selector = $('.slide[data-id='+self.currentSlide+']');
            self.currentItem =  selector.find('[data-index='+self.currentItem+']').length;
            $(window).scrollTo(selector,  {offset:-200, duration : 500});
        }
        self.slidePerc();
        console.log('Current Item', self.currentItem);
    };
    this.next = function() {
        console.log('Current Slide', self.currentSlide);
        self.currentItem = 0;
        if(self.currentSlide < self.settings.totalSlides ) {
            self.currentSlide++;
            $(window).scrollTo($('.slide[data-id=' + self.currentSlide + ']'), {offset: -200, duration: 500});
        }
        self.slidePerc();
        console.log('Current Item', self.currentItem);
    };
    this.home = function (){
        console.log('Current Slide', self.currentSlide);

        self.currentSlide = 1;
        $(window).scrollTo($('.slide[data-id='+self.currentSlide+']'),  {offset:-200, duration : 500});
    };
    this.down = function(){
        console.log('Current Slide', self.currentSlide);
        var selector = $('.slide[data-id='+self.currentSlide+']');
        selector.find('[data-index='+self.currentItem+']').show();
        self.currentItem++;
        console.log('Current Item', self.currentItem);
    };
    this.up = function(){
        console.log('Current Slide', self.currentSlide);

        if(self.currentItem > 0){
            $('.slide[data-id='+self.currentSlide+']').find('[data-index='+self.currentItem+']').hide();
            self.currentItem--;
            console.log('Current Item', self.currentItem);
        }
    };
    this.slidePerc = function(){
        var perc = self.currentSlide/self.settings.totalSlides*100;
        self.slidePercentage(perc);
        console.log(  self.slidePercentage());
        m.render(document.getElementById('footer'),                 [
            m(".progress", { style : "width: 100%; height:10px; display: inline-block" }, [
                m(".progress-bar.progress-bar-info", {style: {"width": self.slidePercentage()+'%'}, "aria-valuemax" : "100", "aria-valuemin" : "0", "aria-valuenow" : self.slidePercentage(), "role"  : "progressbar" }, [
                    m("span.sr-only", "20% Complete")
                ]),
            ])
//            m('div.pull-right',  "built by ohdience")

        ])
    }
    this.fullScreenOn = function(){
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen();
        }
    }
};

app.view = function(ctrl){
        return [
            m(".navbar.navbar-default.navbar-fixed-top[role='navigation']", [
                m(".container-fluid", [
                    m(".navbar-header", [
                        m("a.navbar-brand[href='#']", ctrl.settings.title)
                    ]),
                    m(".navbar-collapse.collapse", [
                        m("ul.nav.navbar-nav.navbar-right", [
                            m("li", [m("span.href", { onclick : ctrl.fullScreenOn }, [ m('span.glyphicon.glyphicon-fullscreen')] ) ]),
                            m("li", [m("span.href", { onclick : ctrl.home }, [ m('span.glyphicon.glyphicon-home')] ) ]),
                            m("li", [m("span.href", { onclick : ctrl.prev },  [ m('span.glyphicon.glyphicon-chevron-left')] )]),
                            m("li", [m("span.href", { onclick : ctrl.next }, [ m('span.glyphicon.glyphicon-chevron-right')] )])
                        ])
                    ])
                ])
            ]),
            m(".wrap.clearfix", { config : ctrl.init } , [
                ctrl.content().map(function(item, index){
                    return m(".slide.animated.fadeInDownBig", { "data-id" : index+1, class : ctrl.settings.classes[index] } , [
                        m.trust(item)
                    ])
                })

            ]),
            m('div#footer',"")
        ]
}

m.module(document.body, app);

