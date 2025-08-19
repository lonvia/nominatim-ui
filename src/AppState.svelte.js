class AppState {
  map = $state();
  results = $state.raw();
  resultHighlight = $state(0);
  currentResult = $state.raw();

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
}

export const appState = new AppState();
