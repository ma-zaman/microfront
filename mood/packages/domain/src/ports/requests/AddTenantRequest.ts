export class AddTenantRequest {
  constructor(
    public name: string,
    public labels: Map<string, string>,
    public description: string
  ) {}
}
