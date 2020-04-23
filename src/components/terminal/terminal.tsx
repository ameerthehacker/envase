import React, { useLayoutEffect, useRef } from 'react';
import { Box } from '@chakra-ui/core';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { ResizeObserver } from 'resize-observer';

export interface TerminalProps {
  stream: NodeJS.ReadWriteStream;
}

export default function Terminal({ stream }: TerminalProps) {
  const terminalContainerRef = useRef<HTMLDivElement>();

  useLayoutEffect(() => {
    const terminal = new XTerm();
    const fitAddon = new FitAddon();
    // this will autoresize terminal based on container width and height
    terminal.loadAddon(fitAddon);

    if (terminalContainerRef.current) {
      terminal.open(terminalContainerRef.current);

      const resizeObserver = new ResizeObserver(() => {
        fitAddon.fit();
      });

      resizeObserver.observe(terminalContainerRef.current);

      stream.on('data', (data) => {
        terminal.write(data);
      });

      terminal.onKey((e: { key: string; domEvent: KeyboardEvent }) => {
        const ev = e.domEvent;

        if (ev.keyCode === 13) {
          stream.write('\r');
        } else if (ev.keyCode === 8) {
          stream.write('\b');
        } else {
          stream.write(ev.key);
        }
      });
    }
  }, [stream]);

  return <Box ref={terminalContainerRef} width="100%" height="100vh" />;
}
