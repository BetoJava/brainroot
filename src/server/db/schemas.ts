import { messages, messageAttachments, chats, projects, subMessages, subChats } from "./chat/schemas";
import { users, providers, preConfiguredPrompts, defaultModels } from "./user/schemas";
import { 
  learningConfig,
  learningData
} from "./plugins/learning-synthesis/schemas";

import {
  userRelations,
  providerRelations,
  preConfiguredPromptsRelations,
  defaultModelsRelations
} from "./user/relations";

import {
  projectsRelations,
  chatsRelations,
  messagesRelations,
  messageAttachmentsRelations,
  subMessagesRelations,
  subChatsRelations
} from "./chat/relations";

import {
  learningConfigRelations,
  learningDataRelations
} from "./plugins/learning-synthesis/relations";



export const schemas = {
    messages,
    messageAttachments,
    chats,
    projects,
    subMessages,
    subChats,
    
    users,
    providers,
    preConfiguredPrompts,
    defaultModels,

    learningConfig,
    learningData
  }

export const relations = {
  projectsRelations,
  chatsRelations,
  messagesRelations,
  messageAttachmentsRelations,
  subMessagesRelations,
  subChatsRelations,

  userRelations,
  providerRelations,
  preConfiguredPromptsRelations,
  defaultModelsRelations,

  learningConfigRelations,
  learningDataRelations
}