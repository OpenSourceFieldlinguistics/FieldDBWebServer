var browserify = require("browserify");
var concat = require("gulp-concat");
var gulp = require("gulp");
var literalify = require("literalify");
var React = require("react");
var ReactDOMServer = require("react-dom/server");

// This is our React component, shared by server and browser thanks to browserify
var App = React.createFactory(require("../src/App"));

// A utility function to safely escape JSON for embedding in a <script> tag
function safeStringify(obj) {
  return JSON.stringify(obj)
    .replace(/<\/(script)/ig, "<\\/$1")
    .replace(/<!--/g, "<\\!--")
    .replace(/\u2028/g, "\\u2028") // Only necessary if interpreting as JS, which we do
    .replace(/\u2029/g, "\\u2029"); // Ditto
}

function reactRender(req, res, next) {

  // This endpoint is hit when the browser is requesting bundle.js from the page above
  if (req.params.filename === "bundle.js") {

    res.setHeader("Content-Type", "text/javascript");

    // Here we invoke browserify to package up browser.js and everything it requires.
    // DON'T do it on the fly like this in production - it's very costly -
    // either compile the bundle ahead of time, or use some smarter middleware
    // (eg browserify-middleware).
    // We also use literalify to transform our `require` statements for React
    // so that it uses the global variable (from the CDN JS file) instead of
    // bundling it up with everything else
    browserify()
      .add("src/browser.js")
      .transform(literalify.configure({
        "react": "window.React",
        "react-dom": "window.ReactDOM",
      }))
      .bundle()
      .pipe(res);

  } else if (req.params.filename === "bundle.css") {

    res.setHeader("Content-Type", "text/css");

    // TEMP bundling css
    gulp
      .src([
        "public/corpus-pages/bootstrap/css/bootstrap.min.css",
        "public/corpus-pages/css/jquery.jsonview.css",
        "public/corpus-pages/bootstrap/css/bootstrap-responsive.min.css",
        "public/corpus-pages/padding.css",
        "public/corpus-pages/search.css"
      ])
      .pipe(concat("bundle.css"))
      .pipe(gulp.dest("public"));

    res.send();
  } else if (req.params.filename === undefined) {
    // If we hit the homepage, then we want to serve up some HTML - including the
    // server-side rendered React component(s), as well as the script tags
    // pointing to the client-side code

    res.setHeader("Content-Type", "text/html; charset=utf-8");

    // `props` represents the data to be passed in to the React component for
    // rendering - just as you would pass data, or expose variables in
    // templates such as Jade or Handlebars.  We just use some dummy data
    // here (with some potentially dangerous values for testing), but you could
    // imagine this would be objects typically fetched async from a DB,
    // filesystem or API, depending on the logged-in user, etc.
    var props = {
      items: [
        "Item 0",
        "Item 1",
        "Item </scRIpt>\u2028",
        "Item <!--inject!-->\u2029",
      ]
    };

    // Here we're using React to render the outer body, so we just use the
    // simpler renderToStaticMarkup function, but you could use any templating
    // language (or just a string) for the outer page template
    var head = ReactDOMServer.renderToStaticMarkup(React.DOM.head(null,

      React.DOM.title({}, ["Testing server side render"]),

      // Then the browser will fetch and run the browserified bundle consisting
      // of browser.js and all its dependencies.
      // We serve this from the endpoint a few lines down.
      React.DOM.link({
        rel: "stylesheet",
        type: "text/css",
        href: "/bundle.css"
      })

    ));

    var html = ReactDOMServer.renderToStaticMarkup(React.DOM.body(null,

      // The actual server-side rendering of our component occurs here, and we
      // pass our data in as `props`. This div is the same one that the client
      // will "render" into on the browser from browser.js
      React.DOM.div({
        id: "content",
        dangerouslySetInnerHTML: {
          __html: ReactDOMServer.renderToString(new App(props))
        }
      }),

      // The props should match on the client and server, so we stringify them
      // on the page to be available for access by the code run in browser.js
      // You could use any var name here as long as it's unique
      React.DOM.script({
        dangerouslySetInnerHTML: {
          __html: "var APP_PROPS = " + safeStringify(props) + ";"
        }
      }),

      // We'll load React from a CDN - you don't have to do this,
      // you can bundle it up or serve it locally if you like
      React.DOM.script({
        src: "/corpus-pages/libs/react.min.js"
      }),
      // React.DOM.script({
      //   src: "//cdnjs.cloudflare.com/ajax/libs/react/15.4.2/react.min.js"
      // }),
      React.DOM.script({
        src: "/corpus-pages/libs/react-dom.min.js"
      }),
      // React.DOM.script({
      //   src: "//cdnjs.cloudflare.com/ajax/libs/react/15.4.2/react-dom.min.js"
      // }),

      // Then the browser will fetch and run the browserified bundle consisting
      // of browser.js and all its dependencies.
      // We serve this from the endpoint a few lines down.
      React.DOM.script({
        src: "/v5/bundle.js"
      })
    ));


    // Return the page to the browser
    res.send(head + html);

  // Return 404 for all other requests
  } else {
    // res.statusCode = 404;
    // res.end();
    next();
  }
}



exports.reactRender = reactRender;
