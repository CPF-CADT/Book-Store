import { useEffect, useState} from "react";
import { HomeHeader, Footer} from "./HeaderFooter";
import { data } from "react-router-dom";

export function Homepage(){
  const [books, setBooks] = useState([]);
  const [filtersBook, setFilterBook] = useState([]);
  const [filters, setFilters] = useState({
    priceRange: {min: '', max: ''},
    productType: [],
    availability: [],
    brand: [],
    color: [],
    materail: []
  });
  const [sortBy, setSortBy] = useState('alphabetical-asc');
  const [itemPerPage, setItemPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOptions, setFilterOptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //fetch initail data
  useEffect(() => {
    const loadData = async () => {
      try{
        setLoading(true);
        const [bookData, filtersData] = await Promise.all([
          fetch(bookData),
          fetch(filtersData)
        ])
        setBooks(bookData);
        setFilterBook(bookData);
        setFilterOptions(filtersData);
      }catch(err){
        setError('Failed to load data');
        console.error('Error loading data: ', err)
      }finally{
        setLoading(false);
      }
    }
    loadData();
  }, []);

  //apply filter and sorting 
  useEffect(() => {
    let result = [...books];

    if ( filters.priceRange.min || filters.priceRange){
      result = result.filter(book => {
        const price = book.price;
        const min = filters.priceRange.min ? parseFloat(filters.priceRange.min) : 0 ;
        const max = filters.priceRange.max ? parseFloat(filters.priceRange.max) : Infinity ;
        return price >= min && price <= max ;
      });
    }
    // apply category filters
    Object.keys(filters).forEach(filterKey => {
        if ( filterKey !== 'priceRange' && filters[filterKey].length > 0){
          result = result.filter(book => {
            filters[filterKey].some(value => {
              book[filterKey]?.toLowerCase().include(value.toLowerCase());
            })
          });
        }
    })

    // apply sorting 
    result.sort((a, b) => {
      switch (sortBy) {
        case 'alphabetical-asc':
          return a.title.localecompare(b.title);
        case 'alphabetical-desc':
          return b.title.localecompare(a.title);
        case 'price-low-high':
          return a.price - b.price;
        case 'price-high-low':
          return b.price - a.price;
        case 'newest':
          return new data(b.createAt) - data(a.createAt);
        default:
          return 0;
      }
    });

    setFilterBook(result);
    setCurrentPage(1);
  }, [books, filters, sortBy]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  }

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  }

  const handleItemPerPageChange = (newItemPerPage) => {
    setItemPerPage(newItemPerPage);
    setCurrentPage(1);
  }

  //Pagination logic 

  const totalItem = filtersBook.length;
  const totalPages = Math.ceil(totalItem/ itemPerPage);
  const startIndex = (currentPage -1 ) * itemPerPage;
  const endIndex =  startIndex + itemPerPage ;
  const currentBook = filtersBook.slice(startIndex, endIndex);

  //Loading page
  if(loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <HomeHeader/>
        <main className="flex-1 flex item-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4">
              <p className="text-gray-600">Loading Books...</p>
            </div>
          </div>
        </main>
        <Footer/>
      </div>
    )
  }

  //error page
  if (error){
    return(
      <div className="min-h-screen flex flex-col bg-white">
        <HomeHeader/>
        <main className="flex-1 flex-item-center justify-center">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Retry
            </button>
          </div>
        </main>
        <Footer/>
      </div>
    )
  }


  return(
    <div className="min-h-screen flex flex-col bg-white">
      <HomeHeader/>
      <main className="flex-1 flex flex-col">
        <div className="flex flex-1 max-w-7xl mx-auto w-auto pt-12 pb-8 px-4">
          <FilterSidebar
            filters={filters}
            filterOptions={filterOptions}
            onFilterChange={handleFilterChange}
          />

          <section className="flex-1">
            <SortControls
              sortBy={sortBy}
              itemsPerPage={itemPerPage}
              totalItems={totalItem}
              startIndex={startIndex}
              endIndex={Math.min(endIndex, totalItem)}
              onSortChange={handleSortChange}
              onItemsPerPageChange={handleItemPerPageChange}
            />

            <ProductGrid books={currentBook} />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center item-center mt-8 space-x-2">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled = {currentPage === 1}
                  className="px-2 py-3 border rounded disable:opacity-50 disable:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>

                {[...Array(totalPages)].map((_, index)=> (
                  <button 
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-3 py-2 border rounded ${
                      currentPage === index + 1
                      ? 'bg-red-500 text-white'
                      : 'hover:bg-gray-50'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}  
          </section>
        </div>
      </main>
      <Footer/>
    </div>
  );
}