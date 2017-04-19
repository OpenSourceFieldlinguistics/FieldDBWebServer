import { connect } from 'react-redux'
import React, { Component } from 'react'
import superAgent from 'superagent'

import { LOADED_SEARCH_RESULTS } from './actions'
var defaultCorpus

class SearchContainer extends Component {
  static fetchData({store, params, history, urls}) {
    let {searchKeywords, dbname} = params

    store.dispatch({
      type: LOADED_SEARCH_RESULTS,
      payload: {
        datalist: {
          id: 'dispatched',
          title: 'fake search results',
          docs: []
        }
      }
    })

    return SearchContainer.search({ params, urls });

    console.log('fetching search data', params)
    return Promise.resolve({
      datalist: {
        id: 'resolved',
        title: 'resolved fake search results',
        docs: []
      }
    });
  }

  componentDidMount() {
    console.log('search container mounted ', this.props)
  // let {searchKeywords, dbname} = this.props.params
  }

  reindex(dbname) {
    var lexicon = {
      url: $('#search-corpus').data('lexicon-url')
    }

    $('#inner-search-progress-bar').width(0).html('&nbsp;')
    $('#search-progress-bar').css('display', 'inline-block')
    $('#search-progress-bar').show()
    var url = lexicon.url + '/search/' + dbname + '/index'
    var checks = 0

    return superAgent.post(url)
    .send({})
    .then(function(response) {
      var total = response.couchDBResult.rows.length
      $('#inner-search-progress-bar').width($('#search-progress-bar').width())
      $('#inner-search-progress-bar').html('<strong>' + total + '</strong> records indexed.&nbsp;&nbsp;')
      $('#search-progress-bar').delay(9000).hide(600)
    }).catch(function(err) {
      $('#inner-search-progress-bar').width($('#search-progress-bar').width())
      $('#inner-search-progress-bar').css('font-size', '.7em').html('<strong>' + err.statusText + ':</strong> 0 records indexed.&nbsp;&nbsp;')
      $('#search-progress-bar').delay(9000).hide(600)
      console.log('Error from trainings ', err)
    })
  }

  progress(percent, $element) {
    var progressBarWidth = percent * $element.width() / 100
    $('#inner-search-progress-bar').width(progressBarWidth).html(percent + '%&nbsp;')
  }

  clearresults() {
    $('#search-result-area').hide()
    $('#search-result-area-content').hide()
    $('#clearresults').hide()
  }

  handleSearchSubmit(e) {
    e.preventDefault()
    var corpus = window.corpus
    if (corpus) {
      search(corpus)
      return false
    }

    function updateCorpusField(field) {
      if (!defaultCorpus) {
        defaultCorpus = new FieldDB.Corpus(FieldDB.Corpus.prototype.defaults)
      }
      if (!field.type && defaultCorpus.datumFields[field.id]) {
        field.type = defaultCorpus.datumFields[field.id].type
      }
      return field
    }

    $.ajax('/api' + window.location.pathname).done(function(json) {
      corpus = new FieldDB.CorpusMask(json)
      corpus.datumFields.map(updateCorpusField)
      window.corpus = corpus

      search(corpus)
    }).fail(function(err) {
      $('#search-result-area').show()
      $('#clearresults').show()
      $('#search-result-highlight').html('Please try again')
      $('#search-result-json').JSONView(JSON.stringify(err))
      console.log('Error from search ', err)
    })
    return false
  }

  static search({params, urls}) {
    var url = urls.lexicon.url + '/search/' + params.dbname

    console.log('requesting search of ', url, params, urls)
    return superAgent
      .post(url)
      .send({
        query: params.searchKeywords
      })
      .then(function(response) {
      console.log('search response', response)
      return response;
      // $('#search-result-area').show()
      // $('#clearresults').show()
      // $('#search-result-json').JSONView(JSON.stringify(response.hits))
      // $('#search-result-highlight').html('')

      // window.searchList = new FieldDB.DataList({
      //   corpus: corpus,
      //   title: 'Search for ' + data.value
      // })

      // if (!response.hits.hits.length) {
      //   $('#search-result-highlight').html('No results.')
      //   return
      // }
      // response.hits.hits.forEach(function(result) {
      //   renderSearchResult({
      //     result: result,
      //     corpus: corpus,
      //     maxScore: response.hits.max_score
      //   })
      // })

      // $('#search-result-highlight').append('<p>Showing ' + window.searchList.length + ' of ' + response.hits.total + ' results, you can click on any of the items to see more details to further refine your search</p>')
    }).catch(function(err) {
      console.log('error in search ', err);
      return {}
      // throw err;
      // $('#search-result-area').show()
      // $('#clearresults').show()
      // $('#search-result-highlight').html('Please try again')
      // $('#search-result-json').JSONView(JSON.stringify(err))
      // console.log('Error from search ', err)
    })
  }

  render() {
    const {corpus} = this.props

    if (!corpus || !corpus.get('lexicon')) {
      return (
        <div className={this.props.className}>
          Search bar
        </div>
      )
    }

    return (
      <div className={this.props.className}>
        <form id='search-corpus' onSubmit={this.handleSearchSubmit} data-lexicon-url="{corpus.getIn(['lexicon', 'url'])}" method='POST' encType='application/json' className='search-form form-inline'>
          <input type='text' id='query' name='query' placeholder='morphemes:nay OR gloss:des' value={this.props.params.searchKeywords} title='Enter your query using field:value if you know which field you want to search, otherwise you can click Search to see 50 results' />
          <button type='submit' id='corpus_search' className='btn btn-small btn-success'>
            <i className='icon-search icon-white' />
          Search…
        </button>
        </form>
        <button type='button' id='corpus_build' onClick={this.reindex} className='btn btn-small btn-info'>
          <i className='icon-refresh icon-white' /> Rebuild search lexicon
        </button>
        <div id='search-progress-bar' className='search-progress-bar hide'>
          <div id='inner-search-progress-bar' className='inner-search-progress-bar'></div>
        </div>
        <span id='clearresults' className='hide'>
          <button type='button' id='clear_results' onClick={this.clearResults} className='btn btn-small btn-danger'>
            <i className='icon-remove icon-white' /> Clear…
          </button>
        </span>
      </div>
    )
  }
}

SearchContainer.propTypes = {
  className: React.PropTypes.string,
  corpus: React.PropTypes.object.isRequired,
  // loadSearchResults: React.PropTypes.func.isRequired,
  params: React.PropTypes.object.isRequired
}

function mapStateToProps(state) {
  console.log('search container map state to props', state)
  return {
    corpus: state.corpusMaskDetail
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadSearchResults: (datalist) => {
    console.log('calling loadSearchResults', datalist);
      return dispatch({
        type: ActionType.LOADED_SEARCH_RESULTS,
        payload: datalist
      })
    }
  }
}

export { SearchContainer }
export default connect(mapStateToProps, {})(SearchContainer)