import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";

@Entity("news_articles")
export class NewsArticle {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ length: 255 })
  title!: string;

  @Column({ length: 255, nullable: true })
  subtitle!: string;

  @Column({ type: "longtext" })
  content!: string;

  @Column({ length: 255, nullable: true })
  heroImage!: string;

  @Column({ length: 255, nullable: true })
  featureImage!: string;

  @Column({ length: 255, nullable: true })
  imageCaption!: string;

  @Column({ length: 255, nullable: true })
  imageCredit!: string;

  @Column({ length: 100, nullable: true })
  section!: string;

  @Column({ type: "enum", enum: ["draft", "published"], default: "draft" })
  status!: "draft" | "published";

  @Column({ type: "date", nullable: true })
  publicDate!: Date;

  @Column({ nullable: true })
  authorId!: string;

  @ManyToOne(() => User, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "authorId" })
  author!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
