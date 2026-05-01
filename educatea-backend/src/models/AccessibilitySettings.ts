import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";

@Entity("accessibility_settings")
export class AccessibilitySettings {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  userId!: string;

  @OneToOne(() => User, (user) => user.accessibilitySettings, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user!: User;

  @Column({ default: false }) altoContraste!: boolean;
  @Column({ default: false }) modoEscuro!: boolean;
  @Column({ default: false }) espacamentoTexto!: boolean;
  @Column({ default: false }) pararAnimacoes!: boolean;
  @Column({ default: false }) cursorGigante!: boolean;
  @Column({ default: false }) fonteLegivel!: boolean;
  @Column({ default: false }) destacarLinks!: boolean;

  @Column({
    type: "enum",
    enum: ["tritanopia", "protanopia", "deuteranopia"],
    nullable: true,
    default: null,
  })
  daltonismo!: "tritanopia" | "protanopia" | "deuteranopia" | null;

  @Column({ type: "float", default: 1.0 })
  zoom!: number;

  @Column({ default: false }) leitorTexto!: boolean;
  @Column({ default: false }) mascaraLeitura!: boolean;
  @Column({ default: false }) lupa!: boolean;
  @Column({ default: false }) guiaLeitura!: boolean;
  @Column({ default: false }) tecladoVirtual!: boolean;

  @UpdateDateColumn()
  updatedAt!: Date;
}
