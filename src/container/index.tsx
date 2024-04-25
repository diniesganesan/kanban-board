import React, { DragEvent, useState } from 'react';
import {
  HStack,
  Text,
  VStack,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { IProcess, ITasks } from '../util/modal';
import { palette } from '../util/colors';
import { TaskCard } from '../component/taskCard';
import { AddNewTask } from '../component/addNewTask';
import { process } from '../util/data';
import { AddNewModal } from '../component/addNewModal';

export const KanbanBoard = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editTask, setEditTask] = useState<ITasks | undefined>(undefined);
  const [kanbanData, setKanbanData] = useState<IProcess[]>(process);
  const [draggedTask, setDraggedTask] = useState<{
    from: string;
    task: ITasks;
  }>({
    from: '',
    task: {
      comments: [],
      description: '',
      id: '',
      severity: '',
      title: '',
    },
  });

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => e.preventDefault();
  const handleOnDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const toTransfer = e.currentTarget.id;
    setKanbanData((prev) =>
      prev.map((el: IProcess) => {
        if (el.type === toTransfer && toTransfer !== draggedTask.from) {
          const removeDups = new Set([...el.tasks, draggedTask.task]);
          el.tasks = Array.from(removeDups);
        }
        return el;
      })
    );
    setKanbanData((prev) =>
      prev.map((el: IProcess) => {
        return {
          ...el,
          tasks:
            el.type === draggedTask.from && toTransfer !== draggedTask.from
              ? el.tasks.filter((t: ITasks) => t.id !== draggedTask.task.id)
              : el.tasks,
        };
      })
    );

    //only show toast when moving to different stages
    if (toTransfer !== draggedTask.from)
      toast({
        title: `Task ${draggedTask.task.id} is moved to ${toTransfer}`,
        position: 'top-right',
        variant: 'left-accent',
        status: 'success',
        isClosable: true,
      });
  };

  return (
    <>
      <VStack>
        <HStack pt={2}>
          <Text fontWeight="bold">KANBAN BOARD</Text>
        </HStack>
        <HStack alignItems="flex-start" p={5} spacing={0} w="100vw">
          {kanbanData.map((el: IProcess, id: number) => (
            <VStack key={id} w="100vw">
              <HStack bg={palette.header} w="100%">
                <Text
                  w="100%"
                  fontWeight="bold"
                  textAlign="center"
                  color={palette.headerText}
                >
                  {el.type}
                </Text>
              </HStack>
              <VStack
                borderLeft="1px white solid"
                id={el.type}
                onDragOver={handleDragOver}
                onDrop={handleOnDrop}
                bg={palette.content}
                h="100vh"
                overflow="scroll"
                position="relative"
                top={-2}
                p={2}
                w="100%"
              >
                {el.type === 'Backlog' && (
                  <AddNewTask {...{ onOpen, setEditTask }} />
                )}
                {el.tasks.map((tsk: ITasks, tskId: number) => (
                  <TaskCard
                    key={tskId}
                    {...{
                      tsk,
                      type: el.type,
                      setKanbanData,
                      setDraggedTask,
                      onOpen,
                      setEditTask,
                    }}
                  />
                ))}
              </VStack>
            </VStack>
          ))}
        </HStack>
      </VStack>
      <AddNewModal {...{ isOpen, onClose, setKanbanData, editTask }} />
    </>
  );
};
