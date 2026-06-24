export interface NormalizedOffer {
  offerId: string;
  title: string;
  url: string;
  image: string | null;
  price: {
    text: string;
    min: number | null;
    max: number | null;
  };
  supplier: {
    name: string | null;
    shopUrl: string | null;
    years: number | null;
  };
  location: {
    province: string | null;
    city: string | null;
  };
  bizType: string | null;
  verified: {
    factory: boolean;
    business: boolean;
    superFactory: boolean;
  };
  tags: string[];
  isP4P: boolean;
  turnover: string | null;
}

export interface ImageSearchResult {
  success: true;
  imageId: string;
  sourceImage: string;
  matchKeyword: string | null;
  selectedRegionIndex: number;
  regionCandidates: DetectionRegionCandidate[];
  offers: NormalizedOffer[];
}

export interface ImageSearchInput {
  image: string;
  max: number;
  profileDir: string;
  headed: boolean;
  timeoutMs: number;
  debugDir?: string;
  keyword?: string;
  uploadMode?: ImageUploadMode;
}

export type ImageUploadMode = "browser" | "h5";

export interface RegionCandidateTopOffer {
  offerId: string;
  title: string;
  image: string | null;
  priceText: string;
  similarityScore: number | null;
}

export interface DetectionRegionCandidate {
  regionIndex: number;
  switched: boolean;
  matchedKeyword: boolean;
  keywordTitleHits: number;
  titles: string[];
  topOffers: RegionCandidateTopOffer[];
}
