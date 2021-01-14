import { Box, Text } from '@chakra-ui/core';
import Section from '../section/section';
import Vimeo from '../vimeo/vimeo';

export default function WhyEnvase() {
  return (
    <Section bg="#fff">
      <Text id="why-envase" fontSize={['2xl', '4xl']}>
        🤷‍♀️ Why Envase?
      </Text>
      <Text marginTop={1} fontSize="lg">
        Using docker for development is <strong>not easy</strong> as it seems,
        you need to search for the right container image in DockerHub and then
        read the <strong>lengthy, long and boring documentation</strong> to
        understand how to run it with all the right configurations are
        nightmares for someone who is new to Docker. If you need to run
        containers which depened on other like <strong>Wordpress</strong> needs{' '}
        <strong>MySQL</strong> frustrates even experienced developers. Envase
        lets you to do all the above without 😢 tears. Below video shows how
        damn easy it is to run a <strong>MySQL database</strong> in{' '}
        <strong>Envase</strong>.
      </Text>
      <Box marginTop={5}>
        <Vimeo id="500412505" />
      </Box>
    </Section>
  );
}
