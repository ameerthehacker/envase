import React from 'react';
import { Skeleton, Stack } from '@chakra-ui/core';

interface AppCardSkeletonProps {
  count: number;
}

export default function AppCardSkeleton({ count }: AppCardSkeletonProps) {
  const skeletons = [];

  for (let i = 0; i < count; i++) {
    skeletons.push(
      <Skeleton key={i} borderRadius={5} width="108px" height="200px" />
    );
  }

  return <Stack direction="row">{skeletons}</Stack>;
}
