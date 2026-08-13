import { Dialog } from "@base-ui/react";
import { createContext } from "react";

export const createNewPostDialogContext = Dialog.createHandle;
export const NewPostDialogContext = createContext(createNewPostDialogContext());
