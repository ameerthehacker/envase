import React, { useLayoutEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Box } from '@chakra-ui/core';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { ResizeObserver } from 'resize-observer';
import { shellIntoApp } from '../../services/docker';
import { AttachAddon } from 'xterm-addon-attach';
import { dockerode } from '../../services/native';

export default function Shell() {
  const { containerId } = useParams();
  const terminalContainerRef = useRef<HTMLDivElement>();

  useLayoutEffect(() => {
    const terminal = new Terminal();
    const fitAddon = new FitAddon();
    let currentCommand = '';

    function prompt() {
      terminal.write('\r$ ');
    }

    // this will autoresize terminal based on container width and height
    terminal.loadAddon(fitAddon);

    if (terminalContainerRef.current) {
      terminal.open(terminalContainerRef.current);

      const resizeObserver = new ResizeObserver(() => {
        fitAddon.fit();
      });

      resizeObserver.observe(terminalContainerRef.current);

      if (containerId) {
        shellIntoApp(containerId).then((exec) => {
          exec.start(
            { hijack: true, stdin: true },
            (err: any, stream: NodeJS.ReadWriteStream) => {
              prompt();

              stream.on('data', (data) => {
                terminal.write(`\n${data}`);
                prompt();
              });

              terminal.onKey((e: { key: string; domEvent: KeyboardEvent }) => {
                const ev = e.domEvent;
                const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;

                if (ev.keyCode === 13) {
                  stream.write(`${currentCommand}\n`);
                  currentCommand = '';
                  terminal.write('\n');
                  prompt();
                } else if (ev.keyCode === 8) {
                  // Do not delete the prompt
                  if ((terminal as any)._core.buffer.x > 2) {
                    terminal.write('\b \b');
                  }
                } else if (printable) {
                  currentCommand += e.key;
                  terminal.write(e.key);
                }
              });
            }
          );
        });
      }
    }
  }, []);

  return <Box ref={terminalContainerRef} width="100%" height="100vh" />;
}
