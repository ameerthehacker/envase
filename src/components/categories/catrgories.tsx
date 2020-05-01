import React from 'react';
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Stack,
  Checkbox
} from '@chakra-ui/core';

export interface CategoriesProps {
  isOpen: boolean;
  onClose: () => void;
  all: boolean;
  onAllSelected: () => void;
  onChange: (category: Record<string, boolean>) => void;
  categories: Record<string, boolean>;
}

export default function Categories({
  isOpen,
  all,
  onAllSelected,
  onChange,
  onClose,
  categories
}: CategoriesProps) {
  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Categories</DrawerHeader>
        <DrawerBody>
          <Stack>
            <Checkbox isChecked={all} onChange={onAllSelected} size="lg">
              All
            </Checkbox>
            {Object.keys(categories).map((category, index) => (
              <Checkbox
                onChange={() => {
                  const updatedCategory = {
                    [category]: !categories[category]
                  };
                  onChange(updatedCategory);
                }}
                isChecked={categories[category]}
                size="lg"
                key={index}
              >
                {category}
              </Checkbox>
            ))}
          </Stack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
