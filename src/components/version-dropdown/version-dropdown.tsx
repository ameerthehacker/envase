import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  ReactNode
} from 'react';
import { useToast, Input, Box, useColorModeValue } from '@chakra-ui/react';
import { ipcRenderer } from '../../services/native/native';
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
  isDisabled?: boolean;
}

export default function VersionDropdown({
  id,
  image,
  placeholder,
  field,
  form,
  alwaysShowSuggestions,
  isDisabled
}: VersionDropdownProps) {
  const [options, setOptions] = useState<Option[] | undefined>([]);
  const [suggestions, setSuggestions] = useState<Option[]>([]);
  const currentPage = useRef(1);
  const toast = useToast();
  const [inputValue, setInputValue] = useState<string>(field.value || '');
  const highlightColor = useColorModeValue<string, string>(
    'teal.500',
    'blue.500'
  );
  const bgColor = useColorModeValue<string, string>('white', 'gray.700');
  const [isTagsLoading, setIsTagLoading] = useState(false);

  // Teach Autosuggest how to calculate suggestions for any given input value.
  const getSuggestions = (value: string) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0 || !options
      ? []
      : options
          .filter((option) => option.label.toLowerCase().startsWith(inputValue))
          .slice(0, 6);
  };

  // When suggestion is clicked, Autosuggest needs to populate the input
  // based on the clicked suggestion. Teach Autosuggest how to calculate the
  // input value for every given suggestion.
  const getSuggestionValue = (suggestion: Option) => suggestion.value;

  // Use your imagination to render suggestions.
  const renderSuggestion = (
    suggestion: Option,
    { isHighlighted }: RenderSuggestionParams
  ) => (
    <Box
      p={1}
      px={3}
      className="suggestions-container"
      color={isHighlighted ? highlightColor : undefined}
      bg={bgColor}
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
        bg={bgColor}
        width="100%"
        position="absolute"
        borderRadius={5}
        zIndex={2}
        shadow="lg"
        borderWidth={suggestions && suggestions.length > 0 ? '1px' : 0}
        {...containerProps}
        className="suggestions-container"
      >
        {children}
      </Box>
    </Box>
  );

  const onGetImageTagsResult = useCallback(
    (evt: IpcRendererEvent, { res, error }: GetImageTagsResponse) => {
      setIsTagLoading(false);

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
    if (!isDisabled) {
      setIsTagLoading(true);

      ipcRenderer.on(GET_IMAGE_TAGS, onGetImageTagsResult);

      ipcRenderer.send(GET_IMAGE_TAGS, { image });

      return () => {
        ipcRenderer.removeListener(GET_IMAGE_TAGS, onGetImageTagsResult);
      };
    }
  }, [onGetImageTagsResult, image, isDisabled]);

  return (
    <Autosuggest
      suggestions={suggestions}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
      inputProps={{
        placeholder: isTagsLoading ? 'Loading...' : placeholder,
        id,
        ...form,
        ...field,
        disabled: isDisabled || isTagsLoading,
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
