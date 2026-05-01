import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { ChatbotSession } from "./ChatbotSession";

@Entity("chatbot_messages")
export class ChatbotMessage {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  sessionId!: string;

  @ManyToOne(() => ChatbotSession, (session) => session.messages, { onDelete: "CASCADE" })
  @JoinColumn({ name: "sessionId" })
  session!: ChatbotSession;

  @Column({ type: "enum", enum: ["user", "bot"] })
  sender!: "user" | "bot";

  @Column({ type: "text" })
  text!: string;

  @CreateDateColumn()
  timestamp!: Date;
}
