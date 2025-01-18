import { Stack, Transition } from "@mantine/core";
import { ReactElement } from "react";

type Props = {
    visible: boolean,
    minHeight: number,
    minWidth: number,
    children: ReactElement,
};

export const SlideLeftWrapper = ({ visible = false, minHeight, minWidth, children }: Props) => {
    return (
        <Stack mih={minHeight} miw={minWidth} justify="center">
            <Transition mounted={visible} transition="slide-left" duration={400} timingFunction="ease">
                {(styles) => <div style={styles}>{children}</div>}
            </Transition>
        </Stack>
    );
}