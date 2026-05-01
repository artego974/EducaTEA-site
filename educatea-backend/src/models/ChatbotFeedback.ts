import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { ChatbotSession } from "./ChatbotSession";
import { User } from "./User";

export type FeedbackRating = "Péssimo" | "Ruim" | "Regular" | "Bom" | "Excelente";

@Entity("chatbot_feedback")
export class ChatbotFeedback {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  sessionId!: string;

  @ManyToOne(() => ChatbotSession, (session) => session.feedbacks, { onDelete: "CASCADE" })
  @JoinColumn({ name: "sessionId" })
  session!: ChatbotSession;

  @Column({ nullable: true })
  userId!: string;

  @ManyToOne(() => User, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "userId" })
  user!: User;

  @Column({ type: "enum", enum: ["Péssimo", "Ruim", "Regular", "Bom", "Excelente"] })
  rating!: FeedbackRating;

  @Column({ type: "tinyint" })
  ratingValue!: number;

  @CreateDateColumn()
  createdAt!: Date;
}
