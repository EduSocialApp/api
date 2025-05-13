import MessageRepository from '../repositories/message.repository'

class Message extends MessageRepository {}

const message = new Message()
export { message }
