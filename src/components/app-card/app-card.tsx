import React from 'react';
import { Button, Flex } from '@chakra-ui/react';
import AppInfoCard, { AppInfoCardProps } from '../app-info-card/app-info-card';
import { open } from '../../services/native/native';

export interface AppCardProps extends AppInfoCardProps {
  onCreateClick: () => void;
  isDisabled?: boolean;
  isLoading?: boolean;
  website?: string;
}

export default function AppCard({
  name,
  logo,
  isDisabled,
  isLoading,
  onCreateClick,
  description,
  website,
  tags
}: AppCardProps) {
  return (
    <AppInfoCard tags={tags} description={description} name={name} logo={logo}>
      <Flex>
        <Button
          isDisabled={isDisabled}
          colorScheme="green"
          onClick={onCreateClick}
          isLoading={isLoading}
          width="full"
        >
          Create
        </Button>
        {website && (
          <Button
            onClick={() => open(website)}
            colorScheme="orange"
            ml={2}
            width="100%"
            variant="outline"
          >
            Visit Site
          </Button>
        )}
      </Flex>
    </AppInfoCard>
  );
}
