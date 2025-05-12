import ConversationRepository from '../repositories/conversation.repository'

export class Conversation extends ConversationRepository {}

const conversation = new Conversation()
export default conversation
