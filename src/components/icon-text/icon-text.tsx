import React, { ReactElement } from 'react';
import { Stack, Text } from '@chakra-ui/core';

export interface IconTextProps {
  text: string;
  icon: ReactElement;
}

export function IconText({ text, icon }: IconTextProps) {
  return (
    <Stack alignItems="center" direction="row">
      {icon}
      <Text>{text}</Text>
    </Stack>
  );
}
