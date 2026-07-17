export type CategoryKind = "income" | "expense";

export type CreateCategoryInput = {
  userId: string;
  name: string;
  kind: CategoryKind;
};

export type RestoreCategoryInput = CreateCategoryInput & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};

type CategoryProps = CreateCategoryInput & {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

const validCategoryKinds: readonly CategoryKind[] = ["income", "expense"];

export function normalizeCategoryName(name: string): string {
  return name.trim().replace(/\s+/g, " ");
}

export class Category {
  readonly id?: string;
  readonly userId: string;
  readonly name: string;
  readonly kind: CategoryKind;
  private readonly persistedCreatedAt?: Date;
  private readonly persistedUpdatedAt?: Date;

  private constructor(props: CategoryProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.name = props.name;
    this.kind = props.kind;
    this.persistedCreatedAt = props.createdAt
      ? new Date(props.createdAt.getTime())
      : undefined;
    this.persistedUpdatedAt = props.updatedAt
      ? new Date(props.updatedAt.getTime())
      : undefined;
  }

  get createdAt(): Date | undefined {
    return this.persistedCreatedAt
      ? new Date(this.persistedCreatedAt.getTime())
      : undefined;
  }

  get updatedAt(): Date | undefined {
    return this.persistedUpdatedAt
      ? new Date(this.persistedUpdatedAt.getTime())
      : undefined;
  }

  static create(input: CreateCategoryInput): Category {
    const userId = input.userId.trim();
    const name = normalizeCategoryName(input.name);

    if (!userId) {
      throw new Error("user is required");
    }

    if (!name) {
      throw new Error("name is required");
    }

    if (name.length > 80) {
      throw new Error("name must have at most 80 characters");
    }

    if (!validCategoryKinds.includes(input.kind)) {
      throw new Error("category kind is invalid");
    }

    return new Category({ ...input, userId, name });
  }

  static restore(input: RestoreCategoryInput): Category {
    const validatedCategory = Category.create(input);
    const id = input.id.trim();

    if (!id) {
      throw new Error("id is required");
    }

    if (Number.isNaN(input.createdAt.getTime())) {
      throw new Error("created date is invalid");
    }

    if (Number.isNaN(input.updatedAt.getTime())) {
      throw new Error("updated date is invalid");
    }

    return new Category({
      id,
      userId: validatedCategory.userId,
      name: validatedCategory.name,
      kind: validatedCategory.kind,
      createdAt: input.createdAt,
      updatedAt: input.updatedAt
    });
  }
}
