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
  public id: bigint;

  @Column()
  public content: string;
  @Column()
  public done: boolean;

  @CreateDateColumn()
  public createdAt: Date;
  @UpdateDateColumn()
  public updatedAt: Date;
}
