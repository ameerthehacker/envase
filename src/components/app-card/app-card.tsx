import React from 'react';
import { Button, Flex } from '@chakra-ui/core';
import AppInfoCard, { AppInfoCardProps } from '../app-info-card/app-info-card';

export interface AppCardProps extends AppInfoCardProps {
  onCreateClick: () => void;
  isDisabled?: boolean;
  isLoading?: boolean;
}

export default function AppCard({
  name,
  logo,
  isDisabled,
  isLoading,
  onCreateClick
}: AppCardProps) {
  return (
    <AppInfoCard name={name} logo={logo}>
      <Flex>
        <Button
          isDisabled={isDisabled}
          variantColor="green"
          onClick={onCreateClick}
          isLoading={isLoading}
          width="full"
        >
          Create
        </Button>
        <Button variantColor="orange" ml={2} width="100%" variant="outline">
          Visit Site
        </Button>
      </Flex>
    </AppInfoCard>
  );
}
