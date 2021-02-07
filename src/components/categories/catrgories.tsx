import React from 'react';
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Stack,
  Checkbox,
  Button
} from '@chakra-ui/react';
import { FaWindowClose } from 'react-icons/fa';
import { Category } from '../../contracts/category';

export interface CategoriesProps {
  isOpen: boolean;
  onClose: () => void;
  onChange: (category: Record<string, boolean>) => void;
  categories: Record<string, boolean>;
}

export default function Categories({
  isOpen,
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
            <Button
              onClick={() => {
                const updatedCategory: Category = {};

                Object.keys(categories).forEach((category) => {
                  updatedCategory[category] = false;
                });

                onChange(updatedCategory);
              }}
              size="sm"
              rightIcon={<FaWindowClose />}
            >
              Clear All
            </Button>
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
