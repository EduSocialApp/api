import ConversationRepository from '../repositories/conversation.repository'

class Conversation extends ConversationRepository {}

const conversation = new Conversation()
export { conversation }
