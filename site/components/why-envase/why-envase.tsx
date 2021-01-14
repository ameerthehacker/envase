import { Box, Flex, Text } from '@chakra-ui/core';
import Section from '../section/section';

export default function WhyEnvase() {
  return (
    <Section bg="#fff">
      <Text fontSize={['2xl', '4xl']}>🤷‍♀️ Why Envase?</Text>
      <Text fontSize="xl">
        Using docker for development is <strong>not easy</strong> as it seems,
        you need to search for the right container image in DockerHub and then
        read the <strong>lengthy, long and boring documentation</strong> to
        understand how to run it with all the right configurations, even then
        remembering which port that the container exposed, starting and stoping
        the container are nightmares for someone who is new to Docker. If you
        need to run containers which depened on other like{' '}
        <strong>Wordpress</strong> needs <strong>MySQL</strong> frustrates even
        experienced developers.
      </Text>
    </Section>
  );
}
