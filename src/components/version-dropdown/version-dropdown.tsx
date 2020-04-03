import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useToast } from '@chakra-ui/core';
import { ipcRenderer } from '../../services/native';
import { IPC_CHANNELS } from '../../constants';
import { IpcRendererEvent } from 'electron';
import Select from 'react-select';
import { FormikProps, FieldInputProps } from 'formik';

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

interface Option {
  label: string;
  value: string;
}

export interface VersionDropdownProps {
  id?: string;
  image: string;
  placeholder?: string;
  field: FieldInputProps<string>;
  form: FormikProps<any>;
}

export default function VersionDropdown({
  id,
  image,
  placeholder,
  field,
  form
}: VersionDropdownProps) {
  const [options, setOptions] = useState<Option[] | undefined>([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentPage = useRef(1);
  const toast = useToast();

  const onGetImageTagsResult = useCallback(
    (evt: IpcRendererEvent, { res, error }: GetImageTagsResponse) => {
      if (!error) {
        const options = res.results
          .map((result) => result.name)
          .map((tag) => ({ label: tag, value: tag }));
        setOptions((oldOptions): Option[] => {
          if (oldOptions) {
            return [...oldOptions, ...options];
          } else {
            return options;
          }
        });

        setIsLoading(false);

        // increment the page number
        currentPage.current++;

        ipcRenderer.send(GET_IMAGE_TAGS, {
          image,
          pageNo: currentPage.current
        });
      } else {
        toast({
          title: 'Oops!',
          description:
            "Can't fetch versions/tags so you might need to type that yourself",
          status: 'error',
          isClosable: true
        });
      }
    },
    [setOptions, setIsLoading, image]
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
      value={options?.find((option) => option.value === field.value)}
      placeholder={isLoading ? 'Loading...' : placeholder}
      options={options}
      onChange={(option: any) => form.setFieldValue(field.name, option?.value)}
      isDisabled={isLoading}
      onBlur={field.onBlur}
      isClearable={true}
      isSearchable={true}
    ></Select>
  );
}
