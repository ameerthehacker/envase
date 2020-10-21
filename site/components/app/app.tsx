import { Box } from '@chakra-ui/core';
import Hero from '../hero/hero';
import Navbar from '../navbar/navbar';

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
      </Box>
    </Box>
  );
}
