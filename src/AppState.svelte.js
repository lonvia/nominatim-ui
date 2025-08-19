import { generate_nominatim_api_url } from './lib/api_utils.js';

class AppState {
  map = $state();

  results = $state.raw();
  resultHighlight = $state(0);
  currentResult = $state.raw();

  lastApiRequestUrl = $state(null);
  errorMessage = $state();
  requestProgress = $state('finish');

  setResults(newResults) {
    this.results = newResults;
    this.resultHighlight = 0;
    this.currentResult = newResults && newResults.length > 0 ? newResults[0] : null;
  }

  highlightResult(num) {
    if (this.results && this.results.length > num) {
      this.resultHighlight = num;
      this.currentResult = this.results[num];
    }
  }

  async fetchFromApi(endpoint_name, params, callback) {
    const api_url = generate_nominatim_api_url(endpoint_name, params);
    const mock_api_error = (new URLSearchParams(window.location.search)).get('mock_api_error');

    this.requestProgress = 'start';
    if (endpoint_name !== 'status') {
      this.lastApiRequestUrl = null;
    }

    try {
      await fetch(api_url, { headers: Nominatim_Config.Nominatim_API_Endpoint_Headers || {} })
        .then(async (response) => {
          if ((!((response.status >= 200 && response.status < 300) || response.status === 404))
              || mock_api_error === 'fetch'
          ) {
            this.errorMessage = `Error fetching data from ${api_url} (${response.statusText})`;
            return undefined;
          }

          // Parse JSON here instead of returning a promise so we can catch possible
          // errors.
          let data;
          try {
            if (mock_api_error === 'parse') {
              data = JSON.parse('{');
            } else {
              data = await response.json();
            }
          } catch (err) {
            // e.g. 'JSON.parse: unexpected non-whitespace character after JSON data at line 1'
            this.errorMessage = `Error parsing JSON data from ${api_url} (${err})`;
            return undefined;
          }
          return data;
        })
        .then((data) => {
          if (data) {
            if (data.error) {
              this.errorMessage = data.error.message;
            }
            callback(data);
          }
          this.requestProgress = 'finish';
        });
    } catch (error) {
      this.errorMessage = `Error fetching data from ${api_url} (${error})`;
      this.requestProgress = 'finish';
    }

    if (endpoint_name !== 'status') {
      this.lastApiRequestUrl = api_url;
    }
  }
}

export const appState = new AppState();
