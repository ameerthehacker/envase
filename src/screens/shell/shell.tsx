import React, { useLayoutEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Box } from '@chakra-ui/core';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { ResizeObserver } from 'resize-observer';

export default function Shell() {
  const { containerId } = useParams();
  const terminalContainerRef = useRef<HTMLDivElement>();

  useLayoutEffect(() => {
    const terminal = new Terminal();
    const fitAddon = new FitAddon();

    // this will autoresize terminal based on container width and height
    terminal.loadAddon(fitAddon);

    if (terminalContainerRef.current) {
      terminal.open(terminalContainerRef.current);

      const resizeObserver = new ResizeObserver(() => {
        fitAddon.fit();
      });

      resizeObserver.observe(terminalContainerRef.current);

      terminal.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ');
    }
  }, []);

  return <Box ref={terminalContainerRef} width="100%" height="100vh" />;
}
