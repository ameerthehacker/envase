import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Image,
  Text,
  useDisclosure
} from '@chakra-ui/core';
import { ReactNode, useRef } from 'react';
import { GITHUB_REPO } from '../../constants';
import styles from './navbar.module.css';
import logo from './logo.png';
import { MdMenu } from 'react-icons/md';

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const menuRef = useRef(null);

  return (
    <Flex
      position="fixed"
      height="60px"
      bg="#fff"
      width="100%"
      top={0}
      paddingLeft={[6, 6, 6, 0]}
      justifyContent="center"
      zIndex={2}
    >
      <Flex alignItems="center" maxWidth="1100px" width="100%" bg="#fff">
        <Flex fontSize="md" gridColumn={2}>
          <Flex alignItems="center">
            <Box
              ref={menuRef}
              cursor="pointer"
              onClick={onOpen}
              display={['block', 'block', 'block', 'none']}
              fontSize="4xl"
              as={MdMenu}
              marginRight={1}
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
            <NavLink href="#features">🔨 Features</NavLink>
            <NavLink
              isExternal={true}
              href={`https://github.com/${GITHUB_REPO}`}
            >
              💻 View Source
            </NavLink>
          </Flex>
        </Flex>
        <Drawer
          isOpen={isOpen}
          placement="left"
          onClose={onClose}
          finalFocusRef={menuRef}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Menu</DrawerHeader>
            <DrawerBody>
              <MenuLink onClick={onClose} href="#why-envase" paddingTop={0}>
                🤷‍♀️ Why Envase?
              </MenuLink>
              <MenuLink onClick={onClose} href="#features">
                🔨 Features
              </MenuLink>
              <MenuLink
                onClick={onClose}
                isExternal={true}
                href={`https://github.com/${GITHUB_REPO}`}
              >
                💻 View Source
              </MenuLink>
            </DrawerBody>
            <DrawerFooter></DrawerFooter>
          </DrawerContent>
        </Drawer>
      </Flex>
    </Flex>
  );
}

type LinkProps = {
  href: string;
  children: ReactNode;
  isExternal?: boolean;
  paddingTop?: number;
  onClick?: () => void;
};

function NavLink({ href, children, isExternal }: LinkProps) {
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

function MenuLink({ href, children, isExternal, ...rest }: LinkProps) {
  return (
    <Box paddingTop={2} paddingBottom={2} {...rest}>
      <a href={href} target={isExternal ? 'blank' : ''}>
        {children}
      </a>
    </Box>
  );
}

function BrandLogo() {
  return (
    <Flex alignItems="center">
      <Image height="30px" src={logo} alt="logo" />
      <Text marginLeft={1} fontSize="2xl">
        Envase
      </Text>
    </Flex>
  );
}
