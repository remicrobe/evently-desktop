export class Category {
    id: number | undefined;
    name: string | undefined;
    icon: string | undefined;
    color: string | undefined;
    default: boolean | undefined;

    constructor(object?: Partial<Category>) {
        this.id = object?.id;
        this.name = object?.name;
        this.icon = object?.icon ?? 'tag';
        this.color = object?.color;
        this.default = object?.default;
    }
}
