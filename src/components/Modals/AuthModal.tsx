import { Button, Group, InputLabel, Modal, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { login } from "@/app/login/actions";

export const AuthModal = ({}) => {
    const [authOpened , { open: onAuthOpen, close: onAuthClose }] = useDisclosure(false);

    const formSchema = z.object({
        email: z
          .string()
          .email()
          .min(5, { message: 'Job title must be at least 2 characters' }),
        password: z
          .string()
          .min(3, { message: 'Password must at least be 3 characters' }),
      });
    
      const { handleSubmit, register, formState: {errors} } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          email: '',
          password: '',
        },
      });

      console.log('errors', errors);
    
      async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("VALUES", values);
        await login(values);
      }

    return (
        <>
            <Button onClick={onAuthOpen} variant='destructive'>
                Auth
            </Button>
            <Modal opened={authOpened} onClose={onAuthClose} title="Authentication">
                <form className="" onSubmit={handleSubmit(onSubmit)}>
                    <TextInput label="Email" {...register("email")} />
                    <TextInput label="Password" {...register("password")}/>

                    <Group mt="1rem" justify="end" gap="sm">
                        <Button onClick={onAuthClose}>Close</Button>
                        <Button type="submit">Submit</Button>
                    </Group>
                </form>
            </Modal>
        </>
    );
};