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
  TabPanel,
  Button
} from '@chakra-ui/core';
import { getConfig } from '../../services/docker';
import { Formik, Form, Field } from 'formik';
import { IconText } from '../../components/icon-text/icon-text';
import { FaDocker, FaTerminal } from 'react-icons/fa';

export default function Settings() {
  const config = getConfig();

  // if anyone of them is undefined the input would become uncontrolled
  if (!config.socketPath) config.socketPath = '';
  if (!config.host) config.host = '';
  if (!config.port) config.port = '';
  if (!config.username) config.username = '';
  if (!config.password) config.password = '';

  return (
    <Stack marginTop={3}>
      <Formik initialValues={config} onSubmit={(values) => console.log(values)}>
        {(form) => (
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
                              <FormLabel htmlFor="sock-path">
                                Socket Path
                              </FormLabel>
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
                </TabPanels>
              </Tabs>
              <Stack direction="row">
                <Button type="submit" variantColor="green">
                  Save
                </Button>
                <Button onClick={() => form.resetForm()} variantColor="red">
                  Reset
                </Button>
              </Stack>
            </Stack>
          </Form>
        )}
      </Formik>
    </Stack>
  );
}
