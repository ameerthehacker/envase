import React, { FC } from 'react';
import Categories from '../components/categories/catrgories';
import { getAllTags } from '../utils/utils';
import { FORMULAS } from '../formulas';
import { Category } from '../contracts/category';

export interface FilterProps {
  isFiltersOpen: boolean;
  onFiltersClose: () => void;
}

interface FilterState {
  categories: Category;
}

export default function withFilters<T>(Component: FC<T>) {
  const allCategories = getAllTags(FORMULAS);

  return class ComponentWithFilters extends React.Component<
    FilterProps & T,
    FilterState
  > {
    constructor(props: FilterProps & T) {
      super(props);
      this.state = {
        categories: allCategories
      };
    }

    render() {
      const noCategorySelected =
        Object.keys(this.state.categories)
          .map((category) => this.state.categories[category])
          .filter(Boolean).length === 0;

      return (
        <>
          <Component
            selectedCategories={
              noCategorySelected ? undefined : this.state.categories
            }
            {...(this.props as any)}
          />
          <Categories
            onChange={(category) =>
              this.setState((state) => ({
                categories: {
                  ...state.categories,
                  ...category
                }
              }))
            }
            isOpen={this.props.isFiltersOpen}
            onClose={this.props.onFiltersClose}
            categories={this.state.categories}
          />
        </>
      );
    }
  };
}
