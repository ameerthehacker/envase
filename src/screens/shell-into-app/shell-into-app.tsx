import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { shellIntoApp } from '../../services/docker';
import Terminal from '../../components/terminal/terminal';
import { Box } from '@chakra-ui/core';

export default function ShellIntoApp() {
  const { containerId } = useParams();
  const [stream, setStream] = useState<NodeJS.ReadWriteStream>();

  useEffect(() => {
    if (containerId) {
      shellIntoApp(containerId).then((exec) => {
        exec.start(
          { hijack: true, stdin: true, stdout: true, tty: true },
          (err: any, stream: NodeJS.ReadWriteStream) => {
            setStream(stream);
          }
        );
      });
    }
  }, [containerId]);

  return <Box>{stream && <Terminal stream={stream} />}</Box>;
}
