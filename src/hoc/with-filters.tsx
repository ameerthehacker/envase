import React, { FC, useState } from 'react';
import Categories from '../components/categories/catrgories';
import { getAllTags } from '../utils/utils';
import { FORMULAS } from '../formulas';
import { Box, Text, Flex, Stack } from '@chakra-ui/core';
import { FaFilter, FaInfo, FaInfoCircle } from 'react-icons/fa';

export interface FilterProps {
  isFiltersOpen: boolean;
  onFiltersClose: () => void;
}

export default function withFilters<T>(Component: FC<T>) {
  const allCategories = getAllTags(FORMULAS);

  return function ComponentWithFilter({
    isFiltersOpen,
    onFiltersClose,
    ...rest
  }: FilterProps & T) {
    const [categories, setCategories] = useState(allCategories);
    const noCategorySelected =
      Object.keys(categories)
        .map((category) => categories[category])
        .filter(Boolean).length === 0;

    return (
      <>
        {!noCategorySelected && (
          <Flex p={2} justifyContent="center">
            <Stack direction="row" alignItems="center">
              <Box as={FaInfoCircle} />
              <Text fontSize="sm">Results being altered by filters</Text>
            </Stack>
          </Flex>
        )}
        <Component
          selectedCategories={noCategorySelected ? undefined : categories}
          {...(rest as any)}
        />
        <Categories
          onChange={(category) =>
            setCategories((categories) => ({
              ...categories,
              ...category
            }))
          }
          isOpen={isFiltersOpen}
          onClose={onFiltersClose}
          categories={categories}
        />
      </>
    );
  };
}
