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

export class Category {
  readonly id?: string;
  readonly userId: string;
  readonly name: string;
  readonly kind: CategoryKind;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;

  private constructor(props: CategoryProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.name = props.name;
    this.kind = props.kind;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(input: CreateCategoryInput): Category {
    const userId = input.userId.trim();
    const name = input.name.trim().replace(/\s+/g, " ");

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

    return new Category({
      id: input.id,
      userId: validatedCategory.userId,
      name: validatedCategory.name,
      kind: validatedCategory.kind,
      createdAt: input.createdAt,
      updatedAt: input.updatedAt
    });
  }
}
