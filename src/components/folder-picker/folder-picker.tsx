import React, { useEffect, useCallback, forwardRef } from 'react';
import { IPC_CHANNELS } from '../../constants';
import { IpcRendererEvent } from 'electron';
import { Stack, Input, Box, Button } from '@chakra-ui/core';
import { FaFolderOpen } from 'react-icons/fa';
import { useFormikContext } from 'formik';
import { ipcRenderer } from '../../services/native/native';

const { OPEN_FOLDER_DIALOG } = IPC_CHANNELS;

export interface OpenFolderDialogResult {
  error: boolean | string;
  selectedPath: null | string;
}

export interface FolderPickerProps {
  id?: string;
  placeholder?: string;
}

const FolderPicker = forwardRef<HTMLInputElement, FolderPickerProps>(
  ({ id, placeholder, ...rest }: FolderPickerProps, ref) => {
    const {
      setFieldValue,
      getFieldProps,
      setFieldTouched
    } = useFormikContext();

    const onOpenFolderDialog = useCallback(
      (evt: IpcRendererEvent, res: OpenFolderDialogResult) => {
        if (!res.error && res.selectedPath) {
          // to ensure formik works
          const { name } = getFieldProps(rest as { name: string });
          setFieldValue(name, res.selectedPath);
          // the field is no more untouched
          setFieldTouched(name, true);
        }
      },
      [setFieldValue, setFieldTouched, getFieldProps, rest]
    );

    useEffect(() => {
      ipcRenderer.on(OPEN_FOLDER_DIALOG, onOpenFolderDialog);

      return () => {
        ipcRenderer.removeListener(OPEN_FOLDER_DIALOG, onOpenFolderDialog);
      };
    }, [onOpenFolderDialog]);

    return (
      <Stack direction="row">
        <Input ref={ref} id={id} placeholder={placeholder} {...rest} />
        <Button
          aria-label="browse-folder"
          variantColor="blue"
          onClick={() => ipcRenderer.send(OPEN_FOLDER_DIALOG)}
        >
          <Box as={FaFolderOpen} />
        </Button>
      </Stack>
    );
  }
);

FolderPicker.displayName = 'FolderPicker';

export default FolderPicker;
