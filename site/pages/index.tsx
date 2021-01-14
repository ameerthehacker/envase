import { CSSReset, ThemeProvider } from '@chakra-ui/core';
import App from '../components/app/app';
import fetch from 'isomorphic-fetch';
import { GITHUB_REPO } from '../constants';

export default function Index({
  latestReleaseTag
}: {
  latestReleaseTag: string;
}) {
  return (
    <ThemeProvider>
      <CSSReset />
      <App latestReleaseTag={latestReleaseTag} />
    </ThemeProvider>
  );
}

export const getServerSideProps = async () => {
  try {
    const latestTag = await (
      await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases/latest`)
    ).json();

    return {
      props: {
        latestReleaseTag: latestTag.name
      }
    };
  } catch {
    return {
      props: {
        latestReleaseTag: null
      }
    };
  }
};
