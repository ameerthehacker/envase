import React, { useEffect, useState, useCallback } from 'react';
import { Select } from '@chakra-ui/core';
import { ipcRenderer } from '../../services/native';
import { IPC_CHANNELS } from '../../constants';
import { IpcRendererEvent } from 'electron';

const { GET_IMAGE_TAGS } = IPC_CHANNELS;

export interface GetImageTagsResponse {
  error: boolean | string;
  res: {
    next: string;
    results: {
      name: string;
    }[];
  };
}

export interface VersionDropdownProps {
  id?: string;
  image: string;
  [key: string]: any;
  placeholder?: string;
}

export default function VersionDropdown({
  id,
  image,
  placeholder,
  ...rest
}: VersionDropdownProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const onGetImageTagsResult = useCallback(
    (evt: IpcRendererEvent, { res }: GetImageTagsResponse) => {
      setTags(res.results.map((result) => result.name));
      setIsLoading(false);
    },
    [setTags, setIsLoading]
  );

  useEffect(() => {
    setIsLoading(true);
    ipcRenderer.send(GET_IMAGE_TAGS, { image });

    ipcRenderer.on(GET_IMAGE_TAGS, onGetImageTagsResult);

    return () => {
      ipcRenderer.removeListener(GET_IMAGE_TAGS, onGetImageTagsResult);
    };
  }, [onGetImageTagsResult, image]);

  return (
    <Select
      id={id}
      placeholder={isLoading ? 'Loading...' : placeholder}
      isDisabled={isLoading}
      {...rest}
    >
      {tags.map((tag, index) => (
        <option key={index} value={tag}>
          {tag}
        </option>
      ))}
    </Select>
  );
}
