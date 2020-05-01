import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { shellOrExecIntoApp } from '../../services/docker/docker';
import Terminal from '../../components/terminal/terminal';
import { Box, useToast } from '@chakra-ui/core';
import { parse } from 'query-string';

export default function ShellIntoApp() {
  const { containerId } = useParams();
  const location = useLocation();
  const toast = useToast();
  const queryParams = parse(location.search);
  const cmd = Array.isArray(queryParams.cmd)
    ? queryParams.cmd[0]
    : queryParams.cmd;

  const [stream, setStream] = useState<NodeJS.ReadWriteStream>();

  useEffect(() => {
    if (containerId) {
      shellOrExecIntoApp(containerId, cmd)
        .then((exec) => {
          exec.start(
            { hijack: true, stdin: true, stdout: true, tty: true },
            (err: any, stream: NodeJS.ReadWriteStream) => {
              setStream(stream);
            }
          );
        })
        .catch((err) => {
          toast({
            title: 'Unable to shell',
            description: `${err}`,
            status: 'error',
            isClosable: true
          });
        });
    }
  }, [containerId, cmd, toast]);

  return <Box bg="black">{stream && <Terminal stream={stream} />}</Box>;
}
