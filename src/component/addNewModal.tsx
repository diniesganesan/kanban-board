import {
  Button,
  HStack,
  Icon,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Table,
  Td,
  Text,
  Tr,
  VStack,
  useToast,
} from '@chakra-ui/react';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { IProcess, ITasks } from '../util/modal';
import { TbPlus, TbTrash } from 'react-icons/tb';
import { palette } from '../util/colors';

interface IAddNewModalProps {
  editTask: ITasks | undefined;
  isOpen: boolean;
  onClose: () => void;
  setKanbanData: React.Dispatch<React.SetStateAction<IProcess[]>>;
}
export const AddNewModal = ({
  isOpen,
  onClose,
  setKanbanData,
  editTask,
}: IAddNewModalProps) => {
  const id = `TC${uuidv4().substring(0, 4).toUpperCase()}`;
  const commentRef = useRef<HTMLTextAreaElement | null>(null);
  const toast = useToast();
  const [newTask, setNewTask] = useState<ITasks>({
    id,
    comments: [],
    description: '',
    severity: 'high',
    title: '',
  });

  useEffect(() => {
    setNewTask({
      id: editTask?.id ?? id,
      title: editTask?.title ?? '',
      description: editTask?.description ?? '',
      severity: editTask?.severity ?? 'high',
      comments: editTask?.comments ?? [],
    });
  }, [editTask, isOpen]);

  const handleOnModalClose = () => {
    setNewTask({
      comments: [],
      description: '',
      id,
      severity: 'high',
      title: '',
    });
    onClose();
  };

  const handleTitleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setNewTask((prev) => ({
      ...prev,
      title: e.target.value,
    }));
  };
  const handleDescInput = (e: ChangeEvent<HTMLInputElement>) => {
    setNewTask((prev) => ({
      ...prev,
      description: e.target.value,
    }));
  };
  const handleSelectInput = (e: ChangeEvent<HTMLSelectElement>) => {
    setNewTask((prev) => ({
      ...prev,
      severity: e.target.value,
    }));
  };
  const handleAddComments = () => {
    if (commentRef.current && commentRef.current.value) {
      setNewTask((prev) => ({
        ...prev,
        comments: [...prev.comments, commentRef.current!.value],
      }));
    }
  };
  const handleRemoveComments = (el: string) => {
    setNewTask((prev) => ({
      ...prev,
      comments: prev.comments.filter((e) => e !== el),
    }));
  };
  const handleAddTask = () => {
    if (editTask) {
      setKanbanData((prev) =>
        prev.map((el: IProcess) => {
          const updTask = el.tasks.map((t: ITasks) => {
            if (t.id === editTask.id) t = newTask;
            return t;
          });

          return {
            ...el,
            tasks: updTask,
          };
        })
      );

      //clear form
      setNewTask({
        comments: [],
        description: '',
        id,
        severity: 'high',
        title: '',
      });

      toast({
        title: `Task ${newTask.id} edited`,
        position: 'top-right',
        variant: 'left-accent',
        status: 'success',
        isClosable: true,
      });

      onClose();
      return;
    }

    // new task added to Backlog
    setKanbanData((prev) =>
      prev.map((el: IProcess) => {
        if (el.type === 'Backlog') el.tasks.push(newTask);
        return el;
      })
    );
    onClose();

    //clear form
    setNewTask({
      comments: [],
      description: '',
      id,
      severity: 'high',
      title: '',
    });

    toast({
      title: `Task ${newTask.id} added to Backlog`,
      position: 'top-right',
      variant: 'left-accent',
      status: 'success',
      isClosable: true,
    });
  };
  return (
    <>
      <Modal isOpen={isOpen} onClose={handleOnModalClose} size="xl">
        <ModalOverlay
          bg="none"
          backdropFilter="auto"
          backdropInvert="80%"
          backdropBlur="2px"
        />
        <ModalContent>
          <ModalHeader>{newTask.id}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Table>
              <Tr border="2px transparent solid">
                <Td>Title</Td>
                <Td>
                  <Input
                    type="text"
                    value={newTask.title}
                    h={8}
                    onChange={handleTitleInput}
                  />
                </Td>
              </Tr>
              <Tr border="2px transparent solid">
                <Td>Description</Td>
                <Td>
                  <Input
                    type="text"
                    value={newTask.description}
                    h={8}
                    onChange={handleDescInput}
                  />
                </Td>
              </Tr>
              <Tr border="2px transparent solid">
                <Td>Severity</Td>
                <Td>
                  <Select
                    placeholder="Select option"
                    onChange={handleSelectInput}
                    value={newTask.severity}
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </Select>
                </Td>
              </Tr>
              <Tr border="2px transparent solid">
                <Td>Comments</Td>
                <Td>
                  <textarea
                    ref={commentRef}
                    style={{
                      padding: 5,
                      border: '1px #e2e8f0 solid',
                      borderRadius: 5,
                      width: '100%',
                      minHeight: '50px',
                    }}
                  />
                </Td>
                <Td>
                  <IconButton
                    onClick={handleAddComments}
                    bg={palette.add}
                    _hover={{
                      bg: palette.add,
                      opacity: 0.8,
                    }}
                    size="xs"
                    aria-label="add-comment"
                    icon={<Icon as={TbPlus} boxSize={4} />}
                  />
                </Td>
              </Tr>
            </Table>
            {newTask.comments.length > 0 && (
              <VStack
                borderTop="1px #e2e8f0 solid"
                w="100%"
                pt={5}
                pb={5}
                alignItems="flex-start"
              >
                <Text fontWeight="bold">Comments Section</Text>
              </VStack>
            )}
            <div style={{ height: 150, overflow: 'auto' }}>
              {newTask.comments.map((el: string, id: number) => (
                <VStack key={id} pt={1} pb={1}>
                  <HStack w="100%">
                    <HStack w="100%">
                      <Text>{el}</Text>
                    </HStack>
                    <IconButton
                      onClick={() => handleRemoveComments(el)}
                      mr={5}
                      bg={palette.remove}
                      _hover={{
                        bg: palette.remove,
                        opacity: 0.8,
                      }}
                      size="xs"
                      aria-label="remove-comment"
                      icon={<Icon as={TbTrash} boxSize={4} />}
                    />
                  </HStack>
                </VStack>
              ))}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleAddTask}
              isDisabled={!newTask.title}
            >
              {editTask ? 'Edit' : 'Add'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
