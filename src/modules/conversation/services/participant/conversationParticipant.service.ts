import ConversationParticipantRepository from '../../repositories/participant/conversationParticipant.repository'

class ConversationParticipant extends ConversationParticipantRepository {}

const conversationParticipant = new ConversationParticipant()
export { conversationParticipant }
