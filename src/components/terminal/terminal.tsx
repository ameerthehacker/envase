import React, { useRef, useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { Unicode11Addon } from 'xterm-addon-unicode11';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { ResizeObserver } from 'resize-observer';
import ansiColors from 'ansi-colors';
import { allSettings, clipboard } from '../../services/native/native';
import './terminal.css';

export interface TerminalProps {
  stdin?: boolean;
  stream: NodeJS.ReadWriteStream;
  followTail?: boolean;
}

export default function Terminal({ stream, stdin, followTail }: TerminalProps) {
  const terminalContainerRef = useRef<any>();
  const isStreamOpen = useRef<boolean>(true);
  const terminalRef = useRef<XTerm>();
  const cmdPressed = useRef(false);
  const asciiKeyMap = useRef({
    CTRL_C: '\x03',
    CTRL_A: '\x01',
    CTRL_E: '\x05',
    CTRL_Z: '\x1A',
    ESC: '\x1B',
    TAB: '\x09',
    LEFT_ARROW: '\u001b[D',
    UP_ARROW: '\u001b[A',
    RIGHT_ARROW: '\u001b[C',
    DOWN_ARROW: '\u001b[B',
    ENTER: '\r',
    BACKSPACE: '\b'
  });
  const keyCodeMap = useRef({
    ESC: 27,
    TAB: 9,
    LEFT_ARROW: 37,
    UP_ARROW: 38,
    RIGHT_ARROW: 39,
    DOWN_ARROW: 40,
    ENTER: 13,
    BACKSPACE: 8
  });

  useEffect(() => {
    const terminal = new XTerm({
      fontSize: allSettings.terminalFontSize
    });
    const fitAddon = new FitAddon();
    const unicodeAddon = new Unicode11Addon();
    const webLinksAddon = new WebLinksAddon();
    const dataListener = (data: any) => {
      terminal.write(data);
    };
    // this will autoresize terminal based on container width and height
    terminal.loadAddon(fitAddon);
    terminal.loadAddon(unicodeAddon);
    terminal.loadAddon(webLinksAddon);
    // special handling for mac keybindings
    terminal.attachCustomKeyEventHandler((evt) => {
      if (evt.key === 'Meta') {
        if (evt.type === 'keydown') {
          cmdPressed.current = true;
        } else {
          cmdPressed.current = false;
        }
      }

      if (cmdPressed.current) {
        // cmd + v handling for mac
        if (evt.key === 'v') stream.write(clipboard.readText('clipboard'));
        if (evt.key === 'k') terminal.clear();
      }

      return true;
    });
    terminalRef.current = terminal;

    if (terminalContainerRef.current) {
      terminal.open(terminalContainerRef.current);

      const resizeObserver = new ResizeObserver(() => {
        if (terminalContainerRef.current) {
          fitAddon.fit();
        }
      });

      resizeObserver.observe(terminalContainerRef.current);

      stream.on('data', dataListener);

      if (stdin) {
        stream.on('end', () => {
          isStreamOpen.current = false;
          terminal.write(ansiColors.red(ansiColors.bold('\nSession ended...')));
        });

        terminal.onKey((e: { key: string; domEvent: KeyboardEvent }) => {
          if (isStreamOpen.current) {
            const ev = e.domEvent;

            if (ev.ctrlKey) {
              if (ev.key === 'c') stream.write(asciiKeyMap.current.CTRL_C);
              if (ev.key === 'a') stream.write(asciiKeyMap.current.CTRL_A);
              if (ev.key === 'e') stream.write(asciiKeyMap.current.CTRL_E);
              if (ev.key === 'z') stream.write(asciiKeyMap.current.CTRL_Z);
              if (ev.key === 'v') stream.write(clipboard.readText('clipboard'));
            } else if (ev.keyCode === keyCodeMap.current.ESC)
              stream.write(asciiKeyMap.current.ESC);
            else if (ev.keyCode === keyCodeMap.current.TAB)
              stream.write(asciiKeyMap.current.TAB);
            else if (ev.keyCode === keyCodeMap.current.LEFT_ARROW)
              stream.write(asciiKeyMap.current.LEFT_ARROW);
            else if (ev.keyCode === keyCodeMap.current.UP_ARROW)
              stream.write(asciiKeyMap.current.UP_ARROW);
            else if (ev.keyCode === keyCodeMap.current.RIGHT_ARROW)
              stream.write(asciiKeyMap.current.RIGHT_ARROW);
            else if (ev.keyCode === keyCodeMap.current.DOWN_ARROW)
              stream.write(asciiKeyMap.current.DOWN_ARROW);
            else if (ev.keyCode === keyCodeMap.current.ENTER)
              stream.write(asciiKeyMap.current.ENTER);
            else if (ev.keyCode === keyCodeMap.current.BACKSPACE)
              stream.write(asciiKeyMap.current.BACKSPACE);
            else stream.write(ev.key);
          }
        });
      }
    }

    return () => {
      stream.removeListener('data', dataListener);
    };
  }, [stream, stdin, keyCodeMap, asciiKeyMap]);

  useEffect(() => {
    const listener = () => {
      if (followTail) {
        terminalRef.current?.scrollToBottom();
      }
    };

    stream.on('data', listener);

    return () => {
      stream.removeListener('data', listener);
    };
  }, [stream, followTail]);

  return <Box ref={terminalContainerRef} width="100%" height="100%" />;
}
