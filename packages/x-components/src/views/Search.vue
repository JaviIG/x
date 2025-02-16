<template>
  <div class="search">
    <header class="header">
      <SearchInput />
      <ClearSearchInput>
        <CrossIcon />
      </ClearSearchInput>
    </header>
    <aside class="aside">
      <template v-if="hasFacets">
        <h1>Sort</h1>
        <!-- TODO Use a real `Sort` component -->
        <BaseDropdown v-model="sortValue" :items="sortItems">
          <template #item="{ item, isHighlighted, isSelected }">
            <CheckIcon v-if="isSelected" />
            <ChevronLeftIcon v-if="isHighlighted" />
            {{ item }}
          </template>
        </BaseDropdown>
        <h1>Filters</h1>
        <ClearFilters>Clear all filters</ClearFilters>
        <div v-if="$x.selectedFilters.length > 0">
          <h2>Selected filters</h2>
          <!-- TODO Use a `SelectedFilters` component -->
          <ul data-test="selected-filters">
            <li v-for="filter in $x.selectedFilters" :key="filter.id" data-test="selected-filter">
              {{ filter.label }}
            </li>
          </ul>
        </div>
        <Facets>
          <template #default="{ facet }">
            <h2>{{ facet.label }}</h2>
            <FiltersList v-slot="{ filter }" :filters="facet.filters">
              <SimpleFilter :filter="filter" />
            </FiltersList>
          </template>

          <template #rootCategories_facet>
            <div />
          </template>

          <template #size="{ facet }">
            <h2>{{ facet.label }}</h2>
            <FiltersList v-slot="{ filter }" :filters="facet.filters">
              <SimpleFilter :filter="filter" />
            </FiltersList>
          </template>

          <template #category="{ facet }">
            <h2>{{ facet.label }}</h2>
            <FiltersList v-slot="{ filter }" :filters="facet.filters">
              <HierarchicalFilter :filter="filter" />
            </FiltersList>
          </template>
        </Facets>
      </template>
    </aside>
    <main class="main">
      <template v-if="$x.query.search">
        <h1>Results for {{ searchQuery }}</h1>
        <!-- TODO Use a `Loading` component -->
        <div v-if="$store.state.x.search.status === 'loading'" data-test="loading">Loading...</div>
        <!-- TODO Use a `ResultsGrid` component -->
        <ul>
          <li v-for="result in results" :key="result.name" data-test="result">{{ result.name }}</li>
        </ul>
      </template>
    </main>
  </div>
</template>

<script lang="ts">
  import { Result } from '@empathyco/x-types';
  import Vue from 'vue';
  import { Component } from 'vue-property-decorator';
  import BaseDropdown from '../components/base-dropdown.vue';
  import { State } from '../components/decorators/store.decorators';
  import { CheckIcon, ChevronLeftIcon, CrossIcon } from '../components/icons/index';
  import { XPlugin } from '../plugins/x-plugin';
  import ClearFilters from '../x-modules/facets/components/clear-filters.vue';
  import Facets from '../x-modules/facets/components/facets/facets.vue';
  import HierarchicalFilter from '../x-modules/facets/components/filters/hierarchical-filter.vue';
  import SimpleFilter from '../x-modules/facets/components/filters/simple-filter.vue';
  import FiltersList from '../x-modules/facets/components/lists/filters-list.vue';
  import ClearSearchInput from '../x-modules/search-box/components/clear-search-input.vue';
  import SearchInput from '../x-modules/search-box/components/search-input.vue';
  import { searchXModule } from '../x-modules/search/x-module';

  XPlugin.registerXModule(searchXModule);
  @Component({
    components: {
      CheckIcon,
      CrossIcon,
      ChevronLeftIcon,
      BaseDropdown,
      ClearFilters,
      HierarchicalFilter,
      SimpleFilter,
      FiltersList,
      Facets,
      ClearSearchInput,
      SearchInput
    }
  })
  export default class Search extends Vue {
    @State('search', 'query')
    public searchQuery!: string;
    @State('search', 'results')
    public results!: Result[];
    protected sortItems: string[] = ['Relevance', 'Alphabetical', 'Price'];
    protected sortValue = this.sortItems[0];

    protected get hasFacets(): boolean {
      return Object.keys(this.$x.facets).length > 0;
    }
  }
</script>

<style lang="scss">
  .search {
    display: grid;
    grid-template-areas: 'header header' 'aside main';
    grid-template-columns: minmax(200px, 400px) 1fr;
  }

  .header {
    grid-area: header;
  }

  .aside {
    grid-area: aside;
  }

  .main {
    grid-area: main;
  }

  .x-filters {
    .x-filters {
      margin: 0 0 0 1em;
    }
  }

  .x-filter {
    &--is-selected {
      font-weight: bold;
    }
  }
</style>
