import { Box, Group } from "@mantine/core";
import { ReactElement, useState } from "react";

type Props = {
    color: string,
    setVisible: Function,
    children: ReactElement,
}

export const ExpenseWrapper = ({ color, setVisible, children }: Props) => {    
    return (
        <Group 
            onMouseEnter={() => setVisible(true)} 
            onMouseLeave={() => setVisible(false)} 
            className="overflow-hidden shadow-md lg:w-[49%] w-full rounded-md bg-white px-3 py-2 relative transition-all" 
            justify="space-between"
        >
            <Box className="w-3 h-full absolute left-0 rounded-tl-md rounded-bl-md" bg={color} />
            {children}
        </Group>
    )
}