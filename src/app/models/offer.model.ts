export interface Offer {
  id: string;
  supplierName: string;
  productName: string;
  price: number;
  specifications: OfferSpecification[];
}

export interface OfferSpecification {
  name: string;
  value: string;
}
