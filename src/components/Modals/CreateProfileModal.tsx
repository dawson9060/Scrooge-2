import { Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

export const CreateProfileModal = ({}) => {
    const [createProfileOpened , { open: onCreateOpen, close: onCreateClose }] = useDisclosure(false);

    return (
        <>
            <Button onClick={onCreateOpen} variant='outline'>
                Update Profile
            </Button>
            <Modal opened={createProfileOpened} onClose={onCreateClose} title="Authentication">
                Create Profile
            </Modal>
        </>
    );
};