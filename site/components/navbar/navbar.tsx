import { Box, Flex, Image, Text } from '@chakra-ui/core';
import { ReactNode } from 'react';
import { GITHUB_REPO } from '../../constants';
import styles from './navbar.module.css';
import logo from './logo.png';
import { MdMenu } from 'react-icons/md';

export default function Navbar() {
  return (
    <Flex
      alignItems="center"
      position="fixed"
      top={0}
      height="60px"
      width="100%"
      justifyContent="center"
      bg="white"
      marginLeft={3}
    >
      <Flex fontSize="md" gridColumn={2}>
        <Flex alignItems="center">
          <Box
            cursor="pointer"
            visibility={['visible', 'visible', 'visible', 'hidden']}
            fontSize="5xl"
            as={MdMenu}
            marginRight={2}
          />
          <BrandLogo />
        </Flex>
        <Flex
          marginLeft={10}
          fontSize="lg"
          alignItems="center"
          className={styles.navLinks}
          visibility={['hidden', 'hidden', 'hidden', 'visible']}
        >
          <NavLink href="#why-envase">🤷‍♀️ Why Envase?</NavLink>
          <NavLink href="#solutions">🔨 Solutions</NavLink>
          <NavLink isExternal={true} href={`https://github.com/${GITHUB_REPO}`}>
            💻 View Source
          </NavLink>
        </Flex>
      </Flex>
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
