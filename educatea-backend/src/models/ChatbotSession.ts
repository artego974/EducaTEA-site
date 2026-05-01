import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { User } from "./User";
import { ChatbotMessage } from "./ChatbotMessage";
import { ChatbotFeedback } from "./ChatbotFeedback";

@Entity("chatbot_sessions")
export class ChatbotSession {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ nullable: true })
  userId!: string;

  @ManyToOne(() => User, (user) => user.chatbotSessions, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "userId" })
  user!: User;

  @Column({ type: "enum", enum: ["active", "closed"], default: "active" })
  status!: "active" | "closed";

  @CreateDateColumn()
  startedAt!: Date;

  @Column({ type: "datetime", nullable: true })
  endedAt!: Date;

  @OneToMany(() => ChatbotMessage, (message) => message.session)
  messages!: ChatbotMessage[];

  @OneToMany(() => ChatbotFeedback, (feedback) => feedback.session)
  feedbacks!: ChatbotFeedback[];
}
