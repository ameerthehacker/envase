import { Box, Text } from '@chakra-ui/core';
import Section from '../section/section';
import Vimeo from '../vimeo/vimeo';

export default function Features() {
  return (
    <Section bg="#EBF4FF">
      <Text id="features" fontSize={['2xl', '4xl']}>
        🔨 Language Tools
      </Text>
      <Text fontSize="lg">
        Fancy learning a new language? Envase can help you with one click setup
        of the toolchain required to get started, the below video demonstrates
        how you can start coding in <strong>NodeJS in matter of seconds</strong>{' '}
        without installing anything 🎉 The projects directory you chose in
        Envase will be shared under <strong>/projects</strong> directory in the
        container.
      </Text>
      <Box marginTop={5}>
        <Vimeo id="500468189" />
      </Box>
    </Section>
  );
}
