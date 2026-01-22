import React, { useState } from "react";
import ProductCard from "./ProductCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ChevronDown, Filter, SlidersHorizontal } from "lucide-react";
import { useToast } from "./ui/use-toast";

interface Product {
  id: string;
  title: string;
  price: number;
  condition: "new" | "used" | "refurbished";
  image: string;
  images?: string[];
  seller: {
    name: string;
    rating: number;
    location: string;
    phoneNumber?: string;
    showPhoneNumber?: boolean;
    enableWhatsApp?: boolean;
  };
}

interface ProductGridProps {
  products?: Product[];
  title?: string;
  showFilters?: boolean;
}

const ProductGrid = ({
  products = [],
  title = "Featured Products",
  showFilters = true,
}: ProductGridProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("newest");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const { toast } = useToast();

  // Mock products if none provided
  const mockProducts: Product[] = [
    {
      id: "1",
      title: "Smartphone - Apple iPhone 13 Pro Max - New",
      price: 8500,
      condition: "new",
      image:
        "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=400&q=80",
      images: [
        "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=400&q=80",
        "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=400&q=80",
        "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400&q=80",
      ],
      seller: {
        name: "Tech Imports",
        rating: 4.8,
        location: "Casablanca",
        phoneNumber: "0612345678",
        showPhoneNumber: true,
        enableWhatsApp: true,
      },
    },
    {
      id: "2",
      title: "Smartphone - Samsung Galaxy S21 - Used",
      price: 5200,
      condition: "used",
      image:
        "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=80",
      seller: {
        name: "Mobile World",
        rating: 4.5,
        location: "Rabat",
        phoneNumber: "0623456789",
        showPhoneNumber: true,
        enableWhatsApp: false,
      },
    },
    {
      id: "3",
      title: "Smartphone - Xiaomi Redmi Note 10 - New",
      price: 2300,
      condition: "new",
      image:
        "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&q=80",
      seller: {
        name: "Smart Phones",
        rating: 4.2,
        location: "Marrakech",
        phoneNumber: "0634567890",
        showPhoneNumber: false,
        enableWhatsApp: true,
      },
    },
    {
      id: "4",
      title: "Smartphone - Oppo Reno 6 - Used",
      price: 3800,
      condition: "used",
      image:
        "https://images.unsplash.com/photo-1606041011872-596597976b25?w=400&q=80",
      seller: {
        name: "Phone Experts",
        rating: 4.0,
        location: "Tangier",
        phoneNumber: "0645678901",
        showPhoneNumber: false,
        enableWhatsApp: false,
      },
    },
    {
      id: "5",
      title: "Smartphone - Huawei P40 Pro - New",
      price: 6200,
      condition: "new",
      image:
        "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=400&q=80",
      seller: {
        name: "Digital Hub",
        rating: 4.7,
        location: "Fes",
        phoneNumber: "0656789012",
        showPhoneNumber: true,
        enableWhatsApp: true,
      },
    },
    {
      id: "6",
      title: "Smartphone - OnePlus 9 - Used",
      price: 5800,
      condition: "used",
      image:
        "https://images.unsplash.com/photo-1614796740292-50ae67262ff0?w=400&q=80",
      seller: {
        name: "Tech Valley",
        rating: 4.4,
        location: "Agadir",
        phoneNumber: "0667890123",
        showPhoneNumber: true,
        enableWhatsApp: false,
      },
    },
    {
      id: "7",
      title: "Smartphone - Google Pixel 6 - New",
      price: 7200,
      condition: "new",
      image:
        "https://images.unsplash.com/photo-1635870723802-e88d76ae3ec9?w=400&q=80",
      seller: {
        name: "Phone Gallery",
        rating: 4.6,
        location: "Casablanca",
        phoneNumber: "0678901234",
        showPhoneNumber: false,
        enableWhatsApp: true,
      },
    },
    {
      id: "8",
      title: "Smartphone - Realme GT - Used",
      price: 4100,
      condition: "used",
      image:
        "https://images.unsplash.com/photo-1592434134753-a70baf7979d5?w=400&q=80",
      seller: {
        name: "Mobile Zone",
        rating: 4.3,
        location: "Meknes",
        phoneNumber: "0689012345",
        showPhoneNumber: false,
        enableWhatsApp: false,
      },
    },
  ];

  const displayProducts = products.length > 0 ? products : mockProducts;

  // Pagination logic
  const productsPerPage = 8;
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = displayProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct,
  );
  const totalPages = Math.ceil(displayProducts.length / productsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Use requestAnimationFrame for better performance
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    // Sorting logic would be implemented here
  };

  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters);
  };

  return (
    <div className="w-full bg-background py-8 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">{title}</h2>

            {showFilters && (
              <div className="flex items-center space-x-2">
                <div className="hidden md:flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    Sort by:
                  </span>
                  <Select value={sortBy} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="price-low">
                        Price: Low to High
                      </SelectItem>
                      <SelectItem value="price-high">
                        Price: High to Low
                      </SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="md:hidden"
                  onClick={toggleMobileFilters}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>

                <Button variant="outline" size="sm" className="hidden md:flex">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Advanced Filters
                </Button>
              </div>
            )}
          </div>

          {showMobileFilters && (
            <div className="md:hidden p-4 border rounded-md bg-muted/20">
              <div className="flex flex-col space-y-4">
                <div className="flex flex-col space-y-2">
                  <span className="text-sm font-medium">Sort by:</span>
                  <Select value={sortBy} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="price-low">
                        Price: Low to High
                      </SelectItem>
                      <SelectItem value="price-high">
                        Price: High to Low
                      </SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button variant="outline" size="sm" className="w-full">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Advanced Filters
                </Button>
              </div>
            </div>
          )}

          {/* Product grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {currentProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                title={product.title}
                price={product.price}
                condition={product.condition}
                image={product.image}
                images={product.images}
                sellerName={product.seller.name}
                sellerRating={product.seller.rating}
                location={product.seller.location}
                phoneNumber={product.seller.phoneNumber}
                showPhoneNumber={product.seller.showPhoneNumber}
                enableWhatsApp={product.seller.enableWhatsApp}
                isPremium={product.id === "1" || product.id === "5"}
                isFeatured={product.id === "2" || product.id === "7"}
                onReport={(id) => {
                  toast({
                    title: "Produit signalé",
                    description: "Merci pour votre signalement. Nous allons l'examiner.",
                  });
                }}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                {currentPage > 1 && (
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(currentPage - 1)}
                    />
                  </PaginationItem>
                )}

                {Array.from({ length: totalPages }).map((_, index) => {
                  const page = index + 1;
                  // Show current page, first page, last page, and one page before and after current
                  if (
                    page === 1 ||
                    page === totalPages ||
                    page === currentPage ||
                    page === currentPage - 1 ||
                    page === currentPage + 1
                  ) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          isActive={page === currentPage}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }

                  // Show ellipsis for gaps
                  if (
                    (page === 2 && currentPage > 3) ||
                    (page === totalPages - 1 && currentPage < totalPages - 2)
                  ) {
                    return <PaginationItem key={page}>...</PaginationItem>;
                  }

                  return null;
                })}

                {currentPage < totalPages && (
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(currentPage + 1)}
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;