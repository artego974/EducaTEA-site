import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { User } from "./User";

export type CommentSection = "forum" | "comunidade";

@Entity("comments")
export class Comment {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "text" })
  text!: string;

  @Column({ length: 100 })
  author!: string;

  @Column({ length: 255, nullable: true })
  imageUrl!: string;

  @Column({ length: 255, nullable: true })
  postImageUrl!: string;

  @Column({ type: "enum", enum: ["forum", "comunidade"], default: "forum" })
  section!: CommentSection;

  @Column({ nullable: true })
  userId!: string;

  @ManyToOne(() => User, (user) => user.comments, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "userId" })
  user!: User;

  @Column({ nullable: true })
  parentId!: string;

  @ManyToOne(() => Comment, (c) => c.replies, { nullable: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "parentId" })
  parent!: Comment;

  @OneToMany(() => Comment, (c) => c.parent)
  replies!: Comment[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
