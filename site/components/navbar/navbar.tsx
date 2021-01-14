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
    <Flex justifyContent="center">
      <Flex
        alignItems="center"
        position="fixed"
        top={0}
        height="60px"
        bg="white"
        width="100%"
        paddingLeft={4}
        maxWidth="1100px"
      >
        <Flex fontSize="md" gridColumn={2}>
          <Flex alignItems="center">
            <Box
              ref={menuRef}
              cursor="pointer"
              onClick={onOpen}
              display={['block', 'block', 'block', 'none']}
              fontSize="5xl"
              as={MdMenu}
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
            <NavLink
              isExternal={true}
              href={`https://github.com/${GITHUB_REPO}`}
            >
              💻 View Source
            </NavLink>
          </Flex>
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
            <MenuLink onClick={onClose} href="#solutions">
              🔨 Solutions
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
      <Text marginLeft={1} fontSize="2xl" fontWeight={250}>
        Envase
      </Text>
    </Flex>
  );
}
