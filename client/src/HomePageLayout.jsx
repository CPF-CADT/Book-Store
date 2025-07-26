import  {LoginHeader}  from "./components/HeaderFooter";
import  {Homepage}  from "./components/Homepage";
import ProductGrid from "./components/ProductGrid";
// import FilterSideBar from "./components/FilterSideBar";
import SortControls from "./components/SortControls";
// import FilterSideBar from "./components/FilterSideBar";
export function HomePageLayout() {
  return (
    <>
      <LoginHeader />
      <main className="flex">
        {/* <FilterSideBar /> */}
        <div className="flex-1">
          {/* <SortControls /> */}
          <Homepage/>
          <ProductGrid />
        </div>
      </main>
    </>
  );
}