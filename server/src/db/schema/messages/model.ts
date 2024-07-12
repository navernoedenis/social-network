import { messages, messagesFiles } from './entity';

export type NewMessage = typeof messages.$inferInsert;
export type Message = typeof messages.$inferSelect;

export type NewMessagesFile = typeof messagesFiles.$inferInsert;
export type MessagesFile = typeof messagesFiles.$inferSelect;
