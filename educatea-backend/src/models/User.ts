import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from "typeorm";
import { Comment } from "./Comment";
import { ChatbotSession } from "./ChatbotSession";
import { AccessibilitySettings } from "./AccessibilitySettings";

export type UserRole =
  | "admin"
  | "developer"
  | "student"
  | "teacher"
  | "tutor"
  | "aee"
  | "psychologist"
  | "person_tea"
  | "senac_rs";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ length: 100 })
  name!: string;

  @Column({ length: 150, unique: true })
  email!: string;

  @Column({ length: 255, select: false })
  password!: string;

  @Column({ length: 50, default: "avatar01.png" })
  profilePicture!: string;

  @Column({ length: 50, nullable: true })
  country!: string;

  @Column({ length: 10, nullable: true })
  colorBackground!: string;

  @Column({
    type: "enum",
    enum: ["admin","developer","student","teacher","tutor","aee","psychologist","person_tea","senac_rs"],
    default: "student",
  })
  role!: UserRole;

  @Column({ type: "json", nullable: true })
  tags!: string[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments!: Comment[];

  @OneToMany(() => ChatbotSession, (session) => session.user)
  chatbotSessions!: ChatbotSession[];

  @OneToOne(() => AccessibilitySettings, (settings) => settings.user)
  accessibilitySettings!: AccessibilitySettings;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
