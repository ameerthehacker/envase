import { Box, Flex, Image, Text } from '@chakra-ui/core';
import { ReactNode } from 'react';
import { GITHUB_REPO } from '../../constants';
import styles from './navbar.module.css';
import logo from './logo.png';

export default function Navbar() {
  return (
    <Flex
      alignItems="center"
      width="100%"
      position="fixed"
      top={0}
      height="60px"
      boxShadow="sm"
    >
      <Box className={styles.navContainer}>
        <Flex
          fontSize="md"
          className={styles.navItem}
          justifyContent="space-between"
          width="100%"
        >
          <BrandLogo />
          <Flex marginLeft={10} alignItems="center" className={styles.navLinks}>
            <NavLink href="#why-envase">🤷‍♀️ Why Envase?</NavLink>
            <NavLink href="#solutions">🔨 Solutions</NavLink>
            <NavLink
              isExternal={true}
              href={`https://github.com/${GITHUB_REPO}`}
            >
              💻 View Source
            </NavLink>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
}

type NavLinkProps = {
  href: string;
  children: ReactNode;
  isExternal?: boolean;
};

function NavLink({ href, children, isExternal }: NavLinkProps) {
  return (
    <a
      className={styles.navLink}
      href={href}
      target={isExternal ? 'blank' : ''}
    >
      {children}
    </a>
  );
}

function BrandLogo() {
  return (
    <Flex alignItems="center">
      <Image height="30px" src={logo} alt="logo" />
      <Text marginLeft={1} fontSize="2xl" fontWeight={250}>
        Envase
      </Text>
    </Flex>
  );
}
