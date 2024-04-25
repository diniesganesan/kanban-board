import { Button, HStack, Icon, IconButton, Text } from '@chakra-ui/react';
import React from 'react';
import { palette } from '../util/colors';
import { TbPlaylistAdd } from 'react-icons/tb';
import { ITasks } from '../util/modal';

interface IAddNewTaskProps {
  setEditTask: (e?: ITasks) => void;
  onOpen: () => void;
}
export const AddNewTask = ({ onOpen, setEditTask }: IAddNewTaskProps) => {
  const handleOpenNewTaskModal = () => {
    onOpen();
    setEditTask();
  };
  return (
    <Button
      onClick={handleOpenNewTaskModal}
      bg={palette.card}
      w="100%"
      p={1}
      _hover={{ bg: palette.card, opacity: 0.8 }}
      _active={{ bg: palette.card }}
    >
      <HStack>
        <HStack>
          <IconButton
            bg={palette.add}
            _active={{
              bg: palette.add,
            }}
            _hover={{
              bg: palette.add,
            }}
            size="xs"
            aria-label="new"
            icon={<Icon boxSize={5} as={TbPlaylistAdd} />}
          />
        </HStack>
        <HStack>
          <Text>Add New Task</Text>
        </HStack>
      </HStack>
    </Button>
  );
};
