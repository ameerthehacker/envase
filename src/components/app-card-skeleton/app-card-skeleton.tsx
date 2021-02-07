import React from 'react';
import { Skeleton, Stack } from '@chakra-ui/react';

interface AppCardSkeletonProps {
  count: number;
}

export default function AppCardSkeleton({ count }: AppCardSkeletonProps) {
  const skeletons = [];

  for (let i = 0; i < count; i++) {
    skeletons.push(
      <Skeleton key={i} borderRadius={5} width="140px" height="260px" />
    );
  }

  return (
    <Stack marginTop={4} direction="row">
      {skeletons}
    </Stack>
  );
}
