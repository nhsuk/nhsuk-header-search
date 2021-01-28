// NHS.UK frontend library header JavaScript
import MenuToggle from 'nhsuk-frontend/packages/components/header/menuToggle';
import SearchToggle from 'nhsuk-frontend/packages/components/header/searchToggle';

// Polyfills
import 'nhsuk-frontend/packages/polyfills';

// Load header search
import HeaderSearch from './header-search';

// Initialize components
document.addEventListener('DOMContentLoaded', () => {
  MenuToggle();
  SearchToggle();
  HeaderSearch();
});
