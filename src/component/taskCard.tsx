import {
  Card,
  HStack,
  Icon,
  IconButton,
  Text,
  useToast,
} from '@chakra-ui/react';
import React from 'react';
import { palette } from '../util/colors';
import { TbArrowsMove, TbEdit, TbTrash } from 'react-icons/tb';
import { IProcess, ITasks } from '../util/modal';

interface ITaskCardProps {
  tsk: ITasks;
  type: string;
  onOpen: () => void;
  setEditTask: (e: ITasks) => void;
  setKanbanData: React.Dispatch<React.SetStateAction<IProcess[]>>;
  setDraggedTask: React.Dispatch<
    React.SetStateAction<{ from: string; task: ITasks }>
  >;
}
export const TaskCard = ({
  tsk,
  type,
  onOpen,
  setKanbanData,
  setDraggedTask,
  setEditTask,
}: ITaskCardProps) => {
  const toast = useToast();

  const handleRemoveTask = () => {
    setKanbanData((prev) =>
      prev.map((el: IProcess) => {
        return {
          ...el,
          tasks:
            el.type === type
              ? el.tasks.filter((t: ITasks) => t.id !== tsk.id)
              : el.tasks,
        };
      })
    );

    toast({
      title: `Task ${tsk.id} removed from ${type}`,
      position: 'top-right',
      variant: 'left-accent',
      status: 'success',
      isClosable: true,
    });
  };
  const handleEditTask = (tsk: ITasks) => {
    onOpen();
    setEditTask(tsk);
  };
  return (
    <Card
      draggable
      onDragStart={() => {
        setDraggedTask({
          from: type,
          task: tsk,
        });
      }}
      p={2}
      bg={palette.card}
      w="100%"
      overflow="clip"
      h="60px"
      _hover={{
        height: 'auto',
      }}
    >
      <HStack>
        <Text fontWeight="bold">{tsk.id}</Text>
        <HStack w="100%" justifyContent="flex-end">
          <Icon as={TbArrowsMove} />
        </HStack>
      </HStack>
      <Text>{tsk.title}</Text>
      <HStack pt={2}>
        <IconButton
          onClick={() => handleEditTask(tsk)}
          _hover={{
            bg: palette.edit,
            opacity: 0.8,
          }}
          _active={{
            bg: palette.edit,
          }}
          bg={palette.edit}
          aria-label="edit"
          size="sm"
          icon={<Icon as={TbEdit} boxSize={5} />}
        />
        <IconButton
          onClick={handleRemoveTask}
          _hover={{
            bg: palette.remove,
            opacity: 0.8,
          }}
          _active={{
            bg: palette.remove,
          }}
          bg={palette.remove}
          aria-label="remove"
          size="sm"
          icon={<Icon as={TbTrash} boxSize={5} />}
        />
      </HStack>
    </Card>
  );
};
