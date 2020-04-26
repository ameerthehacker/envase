import React from 'react';
import {
  Stack,
  FormControl,
  FormLabel,
  Input,
  Box,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel
} from '@chakra-ui/core';
import { Form, Field } from 'formik';
import { IconText } from '../icon-text/icon-text';
import { FaDocker, FaTerminal } from 'react-icons/fa';

export default function Settings() {
  return (
    <Form>
      <Stack spacing={5}>
        <Tabs variant="soft-rounded">
          <TabList>
            <Tab>
              <IconText text="Docker" icon={<Box as={FaDocker} />} />
            </Tab>
            <Tab>
              <IconText text="Terminal" icon={<Box as={FaTerminal} />} />
            </Tab>
          </TabList>
          <TabPanels pt={3}>
            <TabPanel>
              <Stack spacing={2}>
                <Box>
                  <Field name="socketPath">
                    {({ field }: { field: any }) => (
                      <FormControl>
                        <FormLabel htmlFor="sock-path">Socket Path</FormLabel>
                        <Input
                          id="sock-path"
                          placeholder="Sock file (supported in linux/unix)"
                          {...field}
                        />
                      </FormControl>
                    )}
                  </Field>
                </Box>
                <Box>
                  <Field name="host">
                    {({ field }: { field: any }) => (
                      <FormControl>
                        <FormLabel htmlFor="host">Host</FormLabel>
                        <Input
                          id="host"
                          placeholder="IP address / FQDN of the host"
                          {...field}
                        />
                      </FormControl>
                    )}
                  </Field>
                </Box>
                <Box>
                  <Field name="port">
                    {({ field }: { field: any }) => (
                      <FormControl>
                        <FormLabel htmlFor="port">Port</FormLabel>
                        <Input
                          id="port"
                          placeholder="Port on which docker is listening in the host"
                          {...field}
                        />
                      </FormControl>
                    )}
                  </Field>
                </Box>
                <Box>
                  <Field name="username">
                    {({ field }: { field: any }) => (
                      <FormControl>
                        <FormLabel htmlFor="username">Username</FormLabel>
                        <Input
                          id="username"
                          placeholder="Username if needed"
                          {...field}
                        />
                      </FormControl>
                    )}
                  </Field>
                </Box>
                <Box>
                  <Field name="password">
                    {({ field }: { field: any }) => (
                      <FormControl>
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <Input
                          type="password"
                          id="password"
                          placeholder="Password if needed"
                          {...field}
                        />
                      </FormControl>
                    )}
                  </Field>
                </Box>
              </Stack>
            </TabPanel>
            <TabPanel pt={3}>terminal</TabPanel>
          </TabPanels>
        </Tabs>
      </Stack>
    </Form>
  );
}
