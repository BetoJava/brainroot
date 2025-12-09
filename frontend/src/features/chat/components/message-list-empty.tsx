import { MessageCircleDashed } from "lucide-react";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export const MessageListEmpty = (
  <Empty>
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <MessageCircleDashed />
      </EmptyMedia>
      <EmptyTitle>Hello</EmptyTitle>
      <EmptyDescription>
        Comment puis-je vous aider ?
      </EmptyDescription>
    </EmptyHeader>
  </Empty>
);
