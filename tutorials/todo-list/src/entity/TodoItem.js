import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class TodoItem extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id;

  @Column({ type: "text" })
  content;
  @Column({ type: "boolean" })
  done;

  @CreateDateColumn()
  createdAt;
  @UpdateDateColumn()
  updatedAt;
}
