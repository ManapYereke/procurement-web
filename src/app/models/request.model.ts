export interface Request {
  id: string;
  title: string;
  category: string;
  maxPrice: number;
  status: string;
  createdAt: string;
  specifications: RequestSpecification[];
}

export interface RequestSpecification {
  name: string;
  operator: string;
  value: string;
}
