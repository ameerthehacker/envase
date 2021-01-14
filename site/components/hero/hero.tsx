import { Box, Button, Image, Stack, Text } from '@chakra-ui/core';
import { GITHUB_REPO } from '../../constants';
import demo from './demo.gif';
import { FaApple, FaWindows, FaLinux } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import Section from '../section/section';
import PlaceHolderImage from './placeholder.png';

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
    <Section bg="#EBF4FF">
      <Stack gridColumn={2} direction="row" flexWrap="wrap" spacing={5}>
        <Box maxWidth={['100%', '100%', '100%', '450px']}>
          <Text fontSize={['2xl', '4xl']}>Homebrew for docker 🎉</Text>
          <Text fontSize={['xl', '2xl']} fontWeight="250" marginTop={3}>
            <strong>Envase</strong> removes the pain from running apps using{' '}
            <strong>docker</strong> by providing an amazing{' '}
            <strong>developer experience</strong> and an one stop shop app store
            for almost all popular applications.
          </Text>
          <Button
            leftIcon={getPlatformIcon(platform)}
            onClick={() => {
              window.open(downloadLink);
            }}
            marginTop={5}
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
        <Image
          fallbackSrc={PlaceHolderImage}
          marginTop={3}
          boxShadow="lg"
          width="600px"
          src={demo}
        />
      </Stack>
    </Section>
  );
}
