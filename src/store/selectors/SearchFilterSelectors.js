/**
 * Search & Filter Selectors
 * Selectors for accessing search and filter state
 */

export const selectSearchFilter = (state) => state.searchFilter;

export const selectSearchQuery = (state) => state.searchFilter?.searchQuery || '';

export const selectLocationFilter = (state) => state.searchFilter?.locationFilter || '';

export const selectCategoryFilter = (state) => state.searchFilter?.categoryFilter || 'all';

export const selectSortBy = (state) => state.searchFilter?.sortBy || 'relevance';

export const selectRatingFilter = (state) => state.searchFilter?.ratingFilter || 0;

export const selectFilteredResults = (state) => state.searchFilter?.filteredResults || [];

export const selectHasFiltersApplied = (state) => state.searchFilter?.hasFiltersApplied || false;

export const selectIsFiltering = (state) => state.searchFilter?.isFiltering || false;

/**
 * Select filter count - number of active filters
 */
export const selectActiveFilterCount = (state) => {
    const filter = state.searchFilter;
    if (!filter) return 0;

    let count = 0;
    if (filter.searchQuery?.trim()) count++;
    if (filter.locationFilter?.trim()) count++;
    if (filter.categoryFilter && filter.categoryFilter !== 'all') count++;
    if (filter.ratingFilter > 0) count++;

    return count;
};
