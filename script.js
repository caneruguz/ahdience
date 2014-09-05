
var app= {}

app.controller = function(){
    var self = this;
    //this.slideNumber = m.route.param("slide");
    this.settings = {
        totalSlides : 3
    }
    this.content = m.prop([]);
    self.next = m.prop(true);
    var deserialize = function (value){
        if(value.trim() != "Not found"){
            self.content().push(value)
            return value;
        } else {
            self.next(false);
        }
    }
    var checkReturn = function(){
        console.log(self.next());
    }
    for(var i = 1; i < self.settings.totalSlides+1; i++){
        console.log(self.content().length)
        m.request({method: "GET", url: "./slides/slide"+i+".html", deserialize: deserialize});
    }



}

app.view = function(ctrl){
        return [
            m(".navbar.navbar-default.navbar-fixed-top[role='navigation']", [
                m(".container", [
                    m(".navbar-header", [
                        m("a.navbar-brand[href='#']", "Presentation Name")
                    ]),
                    m(".navbar-collapse.collapse", [
                        m("ul.nav.navbar-nav.navbar-right", [
                            m("li", [m("a[href='#/']", "Home")]),
                            m("li", [m("a[href='#']", "Prev")]),
                            m("li", [m("a[href='#']", "Next")])
                        ])
                    ])
                ])
            ]),
            m(".container", [
                ctrl.content().map(function(item){
                    console.log("item", item);
                    return m("[id='slides']", [
                        m.trust(item)
                    ])
                })

            ])
        ]
}

//m.module(document.getElementById('slides'), app);
m.route.mode = "hash";

m.route(document.body, "/", {
    "/": app

});