<!DOCTYPE html>
<html {{{ metaHeader.htmlAttributes }}}>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    {{{ metaHeader.title }}}
    {{{ metaHeader.meta }}}
    <meta name="viewport" content="width=device-width">
    <link rel="stylesheet" type="text/css" href="/corpus-pages/bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="/corpus-pages/css/jquery.jsonview.css">
    <link rel="stylesheet" type="text/css" href="/corpus-pages/bootstrap/css/bootstrap-responsive.min.css">
    <link rel="stylesheet" type="text/css" href="/corpus-pages/padding.css">
    <link rel="stylesheet" type="text/css" href="/corpus-pages/search.css">
    <link rel="stylesheet" href="{{{ styleSrc }}}" type="text/css" media="screen" charset="utf-8">
    <!--[if lt IE 9]><script src="//html5shiv.googlecode.com/svn/trunk/html5.js"></script><script>window.html5 || document.write('<script src="corpus-pages/libs/html5shiv.js"><\\/script>')</script><![endif]-->
  </head>
  <body>
    <div class="navbar navbar-inverse navbar-fixed-top">
      <div class="navbar-inner">
        <div class="container">
          <a data-toggle="collapse" data-target=".nav-collapse" class="btn btn-navbar"><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></a><a href="http://lingsync.org" class="brand">LingSync Public URLS : places to share your data</a>
          <div class="nav-collapse collapse">
            <ul class="nav">
              <li class="active"><a href="http://emeld.org/school/what.html">EMELD Data Discoverability Best Practices  </a></li>
              <li><a href="http://app.lingsync.org" class="btn btn-primary">Open LingSync App</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="container-fluid">
      <div class="row-fluid">
        <div class="span3">
          <p class="text-center"><a href="/{{corpusMask.team.username}}"> <img src="https://secure.gravatar.com/avatar/{{corpusMask.team.gravatar}}.jpg?s=200&amp;d=identicon&amp;r=pg" alt="" class="img-polaroid"></a></p>
          <div style="margin: 10px; border-top: 1px solid #ddd; border-bottom: 1px solid #ddd">
            <h1>{{corpusMask.team.name}}</h1>
            <p>{{corpusMask.team.username}}</p>
          </div>
          <div class="well well-small">
            <dl>
              <dt><i style="margin-top:3px" class="icon-folder-open"></i>&nbsp;&nbsp;Interests:</dt>
              <dd>{{corpusMask.team.researchInterest}}</dd>
              <dt><i style="margin-top:3px" class="icon-user"></i>&nbsp;&nbsp;Affiliation:</dt>
              <dd>{{corpusMask.team.affiliation}}</dd>
              <dt><i style="margin-top:3px" class="icon-comment"></i>&nbsp;&nbsp;Description:</dt>
              <dd>{{corpusMask.team.description}}</dd>
            </dl>
          </div>
        </div>
        <div class="span9">
          <div class="row-fluid">
            <div class="span7 offset1">
              <h1 class="media-heading">{{corpusMask.title}}</h1>
              <div style="margin-bottom:40px" class="media">
                <a href="https://corpus.lingsync.org/public-firstcorpus/_design/pages/corpus.html" class="pull-right"><img src="https://secure.gravatar.com/avatar/{{corpusMask.connection.gravatar}}.jpg?s=96&amp;d=retro&amp;r=pg" alt="Corpus image" class="media-object"></a>
                <div class="media-body">
                  <div>{{corpusMask.description}}</div>
                </div>
              </div>
            </div>
            <div class="span4"></div>
          </div>
          <div class="row-fluid">
            <div class="span12"><iframe src="/corpus-pages/libs/activities_visualization/index.html?{{corpusMask.dbname}}" width="100%" height="200" frameborder="0" allowtransparency="true"></iframe></div>
          </div>
          <div class="row-fluid">
            <div class="span11 offset1">
              <form id="search-corpus" action="{{corpusMask.lexicon.url}}/search/{{corpusMask.dbname}}" data-lexicon-url="{{corpusMask.lexicon.url}}" method="POST" enctype="application/json" class="search-form form-inline">
                <input type="text" id="query" name="query" placeholder="morphemes:nay OR gloss:des" title="Enter your query using field:value if you know which field you want to search, otherwise you can click Search to see 50 results">
                <button type="submit" id="corpus_search" class="btn btn-small btn-success">
                  <i class="icon-search icon-white"></i>
                  Search…
                </button>
              </form>
              <button type="button" id="corpus_build" onclick="reindex('{{corpusMask.dbname}}')" class="btn btn-small btn-info">
                <i class="icon-refresh icon-white"></i>
                Rebuild search lexicon
              </button>
              <div id="search-progress-bar" class="search-progress-bar hide">
                <div id="inner-search-progress-bar" class="inner-search-progress-bar"></div>
              </div>
              <span id="clearresults" class="hide">
                <button type="button" id="clear_results" onclick="clearresults()" class="btn btn-small btn-danger">
                  <i class="icon-remove icon-white"></i>
                  Clear…
                </button>
              </span>
            </div>
          </div>
          <div class="row-fluid">
            <div class="span11">
              <ul id="search-result-area" class="nav nav-tabs hide" data-speech-url="{{corpusMask.speech.url}}">
                <li class="active">
                  <a href="#highlights" data-toggle="tab">
                    Highlights
                  </a>
                </li>
                <li>
                  <a href="#json" data-toggle="tab">
                    JSON Results
                  </a>
                </li>
              </ul>
              <div id="search-result-area-content" class="tab-content">
                <div class="tab-pane active" id="highlights">
                  <div id="search-result-highlight" class="accordion">
                  </div>
                </div>
                <div class="tab-pane " id="json">
                  <div id="search-result-json" class="well well-small"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr>
      <footer>
        <p>© {{corpusMask.copyright}} <!-- {{corpusMask.startYear}} --> - 2017 </p>
        <div class="tabbable">
          <ul class="nav nav-tabs">
            <li class="active"><a href="#terms" data-toggle="tab">Terms of Use for {{corpusMask.title}}</a></li>
            <li><a href="#emeldtermsreccomendations" data-toggle="tab">Why have a Terms of Use?</a></li>
          </ul>
          <div class="tab-content">
            <div id="terms" class="tab-pane active">
              <p{{corpusMask.dbname}}</p>
              <p>{{corpusMask.termsOfUse.humanReadable}}</p>
              <span>License: </span><a href="{{corpusMask.license.link}}" rel="license" title="{{corpusMask.license.title}}">{{corpusMask.license.title}}</a>
              <p>{{corpusMask.license.humanReadable}}</p>
              <img src="//i.creativecommons.org/l/by-sa/3.0/88x31.png" alt="License">
            </div>
            <div id="emeldtermsreccomendations" class="tab-pane">
              <ul>
                <li>
                  <dl>
                    EMELD digital language documentation Best Practices #7:
                    <dt>Rights</dt>
                    <dd>Resource creators, researchers and the speech communities who provide the primary data have different priorities over who has access to language resources.</dd>
                    <dt>Solution</dt>
                    <dd>Terms of use should be well documented, and enforced if necessary with encryption or licensing. It is important however to limit the duration of <a target="_blank" href="http://emeld.org/school/classroom/ethics/access.html">access restrictions</a>: A resource whose access is permanently restricted to one user is of no long-term value since it cannot be used once that user is gone.</dd>
                  </dl>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
    <div id="root">{{{ html }}}</div>

    <script src="/components/fielddb/fielddb.js"></script>
    <script async="" src="//www.google-analytics.com/analytics.js"></script>
    <script src="/corpus-pages/js/jquery.js"></script>
    <script src="/corpus-pages/bootstrap/js/bootstrap.min.js"></script>
    <script src="/corpus-pages/js/jquery.jsonview.js"></script>
    <script src="/corpus-pages/libs/search.js"></script>
    <script src="/corpus-pages/libs/analytics.js"></script>

    <script type="text/javascript" charset="utf-8">
      window.__REDUX_STATE__ = '{{{ reduxState }}}';
    </script>

    {{#each scriptSrcs }}
    <script src="{{ this }}"></script>
    {{/each }}
  </body>
</html>
