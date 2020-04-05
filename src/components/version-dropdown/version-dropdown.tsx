import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  ReactNode
} from 'react';
import { useToast, Input, Box, theme, useColorMode } from '@chakra-ui/core';
import { ipcRenderer } from '../../services/native';
import { IPC_CHANNELS } from '../../constants';
import { IpcRendererEvent } from 'electron';
import { FormikProps, FieldInputProps } from 'formik';
import Autosuggest, { RenderSuggestionParams } from 'react-autosuggest';
import './version-dropdown.css';

const { GET_IMAGE_TAGS } = IPC_CHANNELS;

export interface GetImageTagsResponse {
  error: boolean | string;
  res: {
    next: string | null;
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
  alwaysShowSuggestions?: boolean;
}

export default function VersionDropdown({
  id,
  image,
  placeholder,
  field,
  form,
  alwaysShowSuggestions
}: VersionDropdownProps) {
  const [options, setOptions] = useState<Option[] | undefined>([]);
  const [suggestions, setSuggestions] = useState<Option[] | undefined>([]);
  const currentPage = useRef(1);
  const toast = useToast();
  const [inputValue, setInputValue] = useState<string>('');
  const { colorMode } = useColorMode();
  const highlightColor = {
    light: theme.colors.teal[500],
    dark: theme.colors.blue[500]
  };
  const bgColor = {
    light: theme.colors.white,
    dark: theme.colors.gray[700]
  };

  // Teach Autosuggest how to calculate suggestions for any given input value.
  const getSuggestions = (value: string) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0
      ? []
      : options?.filter(
          (option) =>
            option.label.toLowerCase().slice(0, inputLength) === inputValue
        );
  };

  // When suggestion is clicked, Autosuggest needs to populate the input
  // based on the clicked suggestion. Teach Autosuggest how to calculate the
  // input value for every given suggestion.
  const getSuggestionValue = (suggestion: Option) => suggestion.label;

  // Use your imagination to render suggestions.
  const renderSuggestion = (
    suggestion: Option,
    { isHighlighted }: RenderSuggestionParams
  ) => (
    <Box
      p={1}
      px={3}
      className="suggestions-container"
      bg={isHighlighted ? highlightColor[colorMode] : ''}
    >
      {suggestion.label}
    </Box>
  );

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  const onSuggestionsFetchRequested = ({ value }: { value: string }) => {
    setSuggestions(getSuggestions(value));
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const renderInputComponent = (inputProps: any) => <Input {...inputProps} />;

  const renderSuggestionContainer = ({
    containerProps,
    children
  }: {
    children: ReactNode;
    containerProps: any;
  }) => (
    <Box position="relative">
      <Box
        bg={bgColor[colorMode]}
        zIndex={2}
        width="100%"
        position="absolute"
        borderRadius={5}
        borderWidth={suggestions && suggestions.length > 0 ? '1px' : 0}
        shadow="lg"
        {...containerProps}
        className="suggestions-container"
      >
        {children}
      </Box>
    </Box>
  );

  const onGetImageTagsResult = useCallback(
    (evt: IpcRendererEvent, { res, error }: GetImageTagsResponse) => {
      if (!error) {
        const newOptions = res.results
          .map((result) => result.name)
          .map((tag) => ({ label: tag, value: tag }));
        setOptions((oldOptions): Option[] => {
          if (oldOptions) {
            return [...oldOptions, ...newOptions];
          } else {
            return newOptions;
          }
        });

        if (res.next) {
          // increment the page number
          currentPage.current++;

          ipcRenderer.send(GET_IMAGE_TAGS, {
            image,
            pageNo: currentPage.current
          });
        }
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
    [setOptions, image, toast]
  );

  useEffect(() => {
    ipcRenderer.on(GET_IMAGE_TAGS, onGetImageTagsResult);

    ipcRenderer.send(GET_IMAGE_TAGS, { image });

    return () => {
      ipcRenderer.removeListener(GET_IMAGE_TAGS, onGetImageTagsResult);
    };
  }, [onGetImageTagsResult, image]);

  return (
    <Autosuggest
      suggestions={suggestions || []}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
      inputProps={{
        placeholder,
        id,
        ...form,
        ...field,
        value: inputValue,
        onChange: (evt, { newValue }) => {
          setInputValue(newValue);
          form.setFieldValue(field.name, newValue);
        }
      }}
      renderInputComponent={renderInputComponent}
      renderSuggestionsContainer={renderSuggestionContainer}
      alwaysRenderSuggestions={alwaysShowSuggestions}
    />
  );
}
