import React, { useLayoutEffect, useRef } from 'react';
import { Box } from '@chakra-ui/core';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { Unicode11Addon } from 'xterm-addon-unicode11';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { ResizeObserver } from 'resize-observer';
import ansiColors from 'ansi-colors';

export interface TerminalProps {
  stream: NodeJS.ReadWriteStream;
}

export default function Terminal({ stream }: TerminalProps) {
  const terminalContainerRef = useRef<HTMLDivElement>();
  const isStreamOpen = useRef<boolean>(true);

  useLayoutEffect(() => {
    const terminal = new XTerm();
    const fitAddon = new FitAddon();
    const unicodeAddon = new Unicode11Addon();
    const webLinksAddon = new WebLinksAddon();
    // this will autoresize terminal based on container width and height
    terminal.loadAddon(fitAddon);
    terminal.loadAddon(unicodeAddon);
    terminal.loadAddon(webLinksAddon);

    if (terminalContainerRef.current) {
      terminal.open(terminalContainerRef.current);

      const resizeObserver = new ResizeObserver(() => {
        fitAddon.fit();
      });

      resizeObserver.observe(terminalContainerRef.current);

      stream.on('data', (data) => {
        terminal.write(data);
      });

      stream.on('end', () => {
        isStreamOpen.current = false;
        terminal.write(ansiColors.red(ansiColors.bold('\nSession ended...')));
      });

      terminal.onKey((e: { key: string; domEvent: KeyboardEvent }) => {
        if (isStreamOpen.current) {
          const ev = e.domEvent;

          if (ev.ctrlKey) {
            if (ev.key === 'c') stream.write('\x03');
          }
          // enter key
          else if (ev.keyCode === 13) stream.write('\r');
          // backspace key
          else if (ev.keyCode === 8) stream.write('\b');
          else stream.write(ev.key);
        }
      });
    }
  }, [stream]);

  return <Box ref={terminalContainerRef} width="100%" height="100vh" />;
}
