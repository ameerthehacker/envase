import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Stack,
  Progress,
  Text,
  Spinner,
  Code,
  Collapse
} from '@chakra-ui/core';
import { PullProgressEvent } from '../../services/docker';

export interface ProgressModalProps {
  image: string;
  tag: string;
  isOpen: boolean;
  onClose: () => void;
  progress?: Record<string, PullProgressEvent>;
}

function getProgressPercentage(progress: PullProgressEvent) {
  if (progress.progressDetail) {
    // special cases
    if (progress.status.startsWith('Pulling')) return 0;
    if (progress.status.startsWith('Waiting')) return 0;
    if (progress.status.startsWith('Download complete')) return 100;
    if (progress.status.startsWith('Pull complete')) return 100;
    if (progress.status.startsWith('Verifying')) return 100;
    if (progress.status.startsWith('Already exists')) return 100;
    if (progress.status.startsWith('Extracting')) return 100;

    return (
      (progress.progressDetail.current / progress.progressDetail.total) * 100
    );
  } else {
    return 100;
  }
}

function getImageRepoTag(image: string, tag: string) {
  return `${image} ${tag}`;
}

function getOverallProgress(progress: Record<string, PullProgressEvent>) {
  const ids = Object.keys(progress);

  const totalSum = ids.reduce((sum, id) => {
    if (progress[id]) {
      return sum + getProgressPercentage(progress[id]);
    } else {
      return 0;
    }
  }, 0);

  // to avoid showing 100% in the start itself
  if (Object.values(progress).filter((el) => el.progressDetail).length === 0)
    return 0;

  return Math.round(totalSum / ids.length);
}

export default function ProgressModal({
  image,
  isOpen,
  onClose,
  progress,
  tag
}: ProgressModalProps) {
  const imageRepoTag = getImageRepoTag(image, tag);
  let overallPercentage = 0;
  const [showLogs, setShowLogs] = useState(false);

  if (progress) {
    overallPercentage = getOverallProgress(progress);
  }

  return (
    <Modal
      closeOnOverlayClick={false}
      closeOnEsc={false}
      size="xl"
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{`Pulling ${imageRepoTag} (${overallPercentage}%)`}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack>
            {progress && (
              <>
                <Progress value={overallPercentage} />
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() => setShowLogs((showLogs) => !showLogs)}
                >{`${showLogs ? 'Hide' : 'Show'} Logs`}</Button>
                <Collapse isOpen={showLogs}>
                  <Code width="100%" p={3}>
                    {Object.keys(progress || {}).map((id, index) => {
                      return (
                        progress &&
                        progress[id] &&
                        progress[id].progressDetail && (
                          <Stack key={index}>
                            <Text>{`${progress[id].status} ${id}`}</Text>
                            <Text>{progress[id].progress}</Text>
                          </Stack>
                        )
                      );
                    })}
                  </Code>
                </Collapse>
              </>
            )}
            {!progress && (
              <Stack alignItems="center" justifyContent="center">
                <Spinner size="xl" />
                <Text>Preparing...</Text>
              </Stack>
            )}
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Stack direction="row">
            <Button variantColor="red" mr={3} onClick={onClose}>
              Cancel
            </Button>
          </Stack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
