import { Box } from '@chakra-ui/core';
import Features from '../features/features';
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
        <Features />
      </Box>
    </Box>
  );
}
