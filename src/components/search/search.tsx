import React, { useState, ChangeEvent, KeyboardEvent, useEffect } from 'react';
import { InputGroup, Input, InputRightElement, Box } from '@chakra-ui/core';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useDebounce } from 'use-debounce';

export interface SearchProps {
  onSearch: (searchText: string) => void;
}

export default function Search({ onSearch }: SearchProps) {
  const [text, setText] = useState('');
  const [value, , callPending] = useDebounce(text, 500);

  useEffect(() => {
    onSearch(value);
  }, [value, onSearch]);

  return (
    <InputGroup>
      <Input
        onKeyDown={(evt: KeyboardEvent) => {
          // escape key
          if (evt.keyCode === 27) {
            setText('');
          }
          if (evt.keyCode === 13) {
            callPending();
          }
        }}
        placeholder="Search"
        value={text}
        onChange={(evt: ChangeEvent<HTMLInputElement>) =>
          setText(evt.target.value)
        }
      />
      <InputRightElement>
        <Box
          cursor={text.length > 0 ? 'pointer' : 'auto'}
          onClick={() => setText('')}
          as={text.length === 0 ? FaSearch : FaTimes}
        />
      </InputRightElement>
    </InputGroup>
  );
}
