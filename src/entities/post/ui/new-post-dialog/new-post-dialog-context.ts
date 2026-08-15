import { Dialog } from "@base-ui/react";
import { createContext } from "react";

import type { NewPostDialogPayload } from "./new-post-dialog-payload";

export const createNewPostDialogContext = Dialog.createHandle<NewPostDialogPayload>;
export const NewPostDialogContext = createContext(createNewPostDialogContext());
