import { Box, Button, Flex, Image, Stack, Text } from '@chakra-ui/core';
import { GITHUB_REPO } from '../../constants';
import demo from './demo.gif';
import { FaApple, FaWindows, FaLinux } from 'react-icons/fa';
import { useEffect, useState } from 'react';

function getPlatformBinary(platform: string, tag: string) {
  const version = tag.substring(1);

  if (platform.startsWith('mac')) {
    return `envase-${version}.dmg`;
  } else if (platform.startsWith('linux')) {
    return `envase-${version}.AppImage`;
  } else if (platform.startsWith('win')) {
    return `envase-${version}.exe`;
  }
}

function getPlatformIcon(platform: string) {
  if (platform.startsWith('mac')) {
    return FaApple;
  } else if (platform.startsWith('linux')) {
    return FaLinux;
  } else if (platform.startsWith('win')) {
    return FaWindows;
  }
}

export default function Hero({
  latestReleaseTag
}: {
  latestReleaseTag: string;
}) {
  const [platform, setPlatform] = useState('');
  const downloadLink = latestReleaseTag
    ? `https://github.com/${GITHUB_REPO}/releases/download/${latestReleaseTag}/${getPlatformBinary(
        platform,
        latestReleaseTag
      )}`
    : `https://github.com/${GITHUB_REPO}/releases`;

  useEffect(() => {
    setPlatform(navigator.platform.toLowerCase());
  }, []);

  return (
    <Flex paddingTop={8} paddingBottom={8} justifyContent="center" bg="#EBF4FF">
      <Stack gridColumn={2} direction="row" flexWrap="wrap" spacing={5}>
        <Box maxWidth="500px">
          <Text fontSize="3xl">Homebrew for docker 🎉</Text>
          <Text fontSize="2xl" fontWeight="250" marginTop={3}>
            Envase remove the pain from running apps using docker by providing
            an amazing user experience and an one stop shop app store for almost
            all popular applications.
          </Text>
          <Button
            leftIcon={getPlatformIcon(platform)}
            onClick={() => {
              window.open(downloadLink);
            }}
            marginTop={10}
            size="lg"
            variantColor="purple"
            variant="solid"
            borderRadius="75px"
            color="white"
            px={20}
            py={8}
          >
            Download
          </Button>
        </Box>
        <Image boxShadow="lg" width="600px" src={demo} />
      </Stack>
    </Flex>
  );
}
