import { Box } from '@chakra-ui/core';
import Hero from '../hero/hero';
import Navbar from '../navbar/navbar';
import WhyEnvase from '../why-envase/why-envase';

export default function App({
  latestReleaseTag
}: {
  latestReleaseTag: string;
}) {
  return (
    <Box>
      <Navbar />
      <Box marginTop="60px">
        <Hero latestReleaseTag={latestReleaseTag} />
        <WhyEnvase />
      </Box>
    </Box>
  );
}
