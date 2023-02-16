import AccessibleAutoComplete from "accessible-autocomplete";

/**
 * HTML Elements needed for autocomplete
*/
const form = document.getElementById('search');
const input = document.getElementById('search-field');
const container = document.getElementById('autocomplete-container');

/**
 * Check if search URLs are set as globals on window object,
 * Use URL from global or default to live URLs
*/
const searchApiUrl = (window.NHSUK_SETTINGS && window.NHSUK_SETTINGS.SUGGESTIONS_TEST_HOST) || 'https://api.nhs.uk/site-search/Autocomplete';
const searchPageUrl = (window.NHSUK_SETTINGS && window.NHSUK_SETTINGS.SEARCH_TEST_HOST) || 'https://www.nhs.uk/search/';

/**
 * Function to build truncated result with svg for search autocomplete
 * @param {string} result String containing individual result from autocomplete source function
 * @returns {string} String of HTML containing passed result
*/
const suggestion = (result) => {
  const truncateLength = 36;
  const dots = result.length > truncateLength ? '...' : '';
  const resultTruncated = result.substring(0, truncateLength) + dots;
  return `
      <svg class="nhsuk-icon nhsuk-icon__search" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M19.71 18.29l-4.11-4.1a7 7 0 1 0-1.41 1.41l4.1 4.11a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42zM5 10a5 5 0 1 1 5 5 5 5 0 0 1-5-5z"></path></svg>
      ${resultTruncated}
    `;
};

/**
 * Function to populate the search autocomplete.
 * @param {string} query Query to pass to search API
 * @param {function} populateResults Callback function passed to source by autocomplete plugin
*/
const source = (query, populateResults) => {
  // Build URL for search endpoint
  const fullUrl = `${searchApiUrl}?q=${query}&api-version=1`;

  // Async request for results based on query param
  const xhr = new XMLHttpRequest();
  xhr.open('GET', fullUrl);
  xhr.onload = () => {
    if (xhr.status === 200) {
      // Array of display values from json
      const results = JSON.parse(xhr.responseText)
        // Handle new search API
        .map((result) => result.query);

      // Fire callback from autoComplete plugin
      populateResults(results);
    }
    // No message required for error... fails silently to standard form
  };
  xhr.send();
};

/**
 * Callback function to redirect to NHS Search page when an
 * option is selected either with click or enter.
 * @param {string} result Query to pass to search page URL
*/
const onConfirm = (result) => {
  window.location.href = `${searchPageUrl}?q=${result}`;
};

/**
 * Adds event to catch enter presses when the main input is focused and submits the form
*/
const addFormEvents = (el) => {
  // Attach event to form as the original input element is cloned by autoComplete plugin
  el.addEventListener('keyup', ({ key }) => {
    // Submit search using current input value if input is focused and enter is pressed
    if (key === 'Enter' && document.activeElement.id === 'search-field') el.submit();
  });
};

/**
 * Initialises autocomplete
*/
const initAutoComplete = () => {
  // Remove original search input as it will be replaced by accessibleAutocomplete
  input.parentNode.removeChild(input);

  // Initialise accessibleAutocomplete
  AccessibleAutoComplete({
    confirmOnBlur: false,
    element: container,
    id: 'search-field',
    minLength: 2,
    name: input.name,
    onConfirm,
    placeholder: input.placeholder,
    showNoOptionsFound: false,
    source,
    templates: {
      suggestion,
    },
  });
};

export default () => {
  // Add autocomplete functionality if required config options exist
  if (input && container) {
    initAutoComplete();

    // If form element exists then add events to add standard form functionality
    if (form) addFormEvents(form);
  }
};

module.exports = { suggestion, source, onConfirm, addFormEvents };
